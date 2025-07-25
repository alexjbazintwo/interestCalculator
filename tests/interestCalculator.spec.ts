import { test, expect } from "@playwright/test";
import { InterestCalculatorPage } from "../pages/interestCalculatorPage";
import { login } from "../utils/login";
import { CalculatorInputs, calculateInterest } from "../utils/calculateInterest";
import { checkA11y } from "../utils/accessibility";

test.describe("Interest Calculator App", () => {
  let interestPage: InterestCalculatorPage;

  test.beforeEach(async ({ page }) => {
    await login(page);
    interestPage = new InterestCalculatorPage(page);
    await interestPage.goto();
  });

  const testCases: CalculatorInputs[] = [
    { principal: 2000, rate: 10, duration: "Daily" },
    { principal: 5000, rate: 8, duration: "Monthly" }, // FAILS AS MONTHLY CALUCLATION DIVIDED BY 10, IT SHOULD BE BY 12
    { principal: 7500, rate: 4, duration: "Yearly" },
  ];

  for (const { principal, rate, duration } of testCases) {
    test(`The interest and total outputs are as expected when principal=${principal}, the rate=${rate}% and duration=${duration}`, async () => {
      await interestPage.setPrincipalAmount(principal);
      await interestPage.selectInterestRate(rate);
      await interestPage.selectDuration(duration);
      await interestPage.giveConsent();
      await interestPage.clickCalculate();

      const { expectedInterest, expectedTotal } = calculateInterest(
        principal,
        rate,
        duration
      );

      await interestPage.assertInterestResult(expectedInterest);
      await interestPage.assertTotalAmountResult(expectedTotal);
    });
  }

  //FAILS AS NO ERROR SHOWN IF CONSENT NOT GIVEN
  test("Should show error if consent is not given", async () => {
    await interestPage.setPrincipalAmount(1000);
    await interestPage.selectInterestRate(5);
    await interestPage.selectDuration("Monthly");
    const dialogMessage = await interestPage.clickCalculateExpectingAlert();
    expect(dialogMessage).toMatch(/fill in all fields/i);
    // Requirement: "Clear error messages should be displayed to guide users in case of missing or incorrect inputs" - "Fill in all fields" is too generic
  });

  test("Should show error if interest not entered", async () => {
    const dialogMessage = await interestPage.clickCalculateExpectingAlert();
    expect(dialogMessage).toMatch(/fill in all fields/i);
  });

  test("Sshould show error if 0 entered as principal", async () => {
    await interestPage.setPrincipalAmount(0);
    await interestPage.selectInterestRate(5);
    await interestPage.selectDuration("Yearly");
    await interestPage.giveConsent();
    const dialogMessage = await interestPage.clickCalculateExpectingAlert();
    expect(dialogMessage).toMatch(/fill in all fields/i);
  });

  const viewports = [
    { width: 375, height: 812, name: "Mobile" },
    { width: 768, height: 1024, name: "Tablet" },
    { width: 1440, height: 900, name: "Desktop" },
  ];

  for (const viewport of viewports) {
    test(`Should render correctly on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      const vpPage = new InterestCalculatorPage(page);
      await vpPage.goto();
      await vpPage.assertElementsVisibleAtDifferentViewports();
    });
  }

  // FAILS ACCESSIBILITY WITH 4 VIOLATIONS
  test("Accessibility checks should pass", async ({ page }) => {
    const results = await checkA11y(page);
    expect(results.violations.length).toBe(0);
  });

  test("Form inputs and buttons should be reachable by keyboard", async ({
    page,
  }) => {
    await page.keyboard.press("Tab");

    const activeElement = await page.evaluate(
      () => document.activeElement?.tagName
    );
    expect(activeElement).not.toBe("BODY");
  });

  test("Page should load and respond fast enough", async ({ page }) => {
    const metrics = await page.evaluate(() => {
      const navEntry = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      return {
        startTime: navEntry.startTime,
        domContentLoaded: navEntry.domContentLoadedEventEnd,
        loadEventEnd: navEntry.loadEventEnd,
        responseTime: navEntry.responseEnd - navEntry.startTime,
      };
    });
    // Log the actual metrics for debugging
    console.table(metrics);
    //made up values for the sake of the test
    const maxDOMContentLoaded = 100;
    const maxLoadEventEnd = 200;
    const maxResponseTime = 100;

    expect(metrics.domContentLoaded).toBeLessThanOrEqual(maxDOMContentLoaded);
    expect(metrics.loadEventEnd).toBeLessThanOrEqual(maxLoadEventEnd);
    expect(metrics.responseTime).toBeLessThanOrEqual(maxResponseTime);
  });

  //Possible other test cases
  test("Dropdown should close after selecting an interest rate", async ({
    page,
  }) => {});
  test("Interest rates do not exceed 15%", async ({ page }) => {});
  test("Basic test to make sure all elements are present on the page", async ({
    page,
  }) => {});
  test("Calculated values should reset if inputs are changed after a calculation", async ({
    page,
  }) => {});
  test("Error message should disappear after dismissing error", async ({
    page,
  }) => {});
});
