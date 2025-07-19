import { expect, Page } from "@playwright/test";

export class InterestCalculatorPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("http://3.8.242.61/");
  }

  async setPrincipalAmount(value: number) {
    const slider = this.page.locator("#customRange1");

    const min = Number(await slider.getAttribute("min")) || 0;
    const max = Number(await slider.getAttribute("max")) || 15000;
    const step = Number(await slider.getAttribute("step")) || 100;

    const clampedValue = Math.min(max, Math.max(min, value));
    const steppedValue = Math.round(clampedValue / step) * step;

    await slider.evaluate((el, val) => {
      const input = el as HTMLInputElement;
      input.value = val.toString();
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }, steppedValue);
  }

  async selectInterestRate(rate: number) {
    await this.page.locator("#dropdownMenuButton").click();
    await this.page.locator(`input[id='rate-${rate}%']`).check();
    await this.page.mouse.click(10, 10);
  }

  async assertElementsVisibleAtDifferentViewports() {
    await expect(
      this.page.getByRole("heading", { name: "Interest Calculator" })
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Select Interest Rate" })
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Calculate" })
    ).toBeVisible();
    await this.page.locator("#dropdownMenuButton").click();
    await expect(this.page.locator("input[id='rate-15%']")).toBeVisible();
  }

  async selectDuration(duration: "Daily" | "Monthly" | "Yearly") {
    await this.page
      .locator(`#durationList a[data-value='${duration}']`)
      .click();
  }

  async giveConsent() {
    await this.page.locator("#gridCheck1").check();
  }

  async clickCalculate() {
    await this.page.locator("button", { hasText: "Calculate" }).click();
  }

  async assertInterestResult(expectedInterest: number) {
    await expect(
      this.page.getByRole("heading", {
        name: `Interest Amount: ${expectedInterest}`,
      })
    ).toBeVisible();
  }

  async assertTotalAmountResult(expectedTotal: number) {
    await expect(
      this.page.getByRole("heading", {
        name: `Total Amount with Interest: ${expectedTotal}`,
      })
    ).toBeVisible();
  }

  async clickCalculateExpectingAlert(): Promise<string> {
    let dialogMessage = "";

    this.page.once("dialog", async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.dismiss();
    });

    await this.clickCalculate();
    await this.page.waitForTimeout(100);
    return dialogMessage;
  }

  async getInterestResult() {
    return this.page.locator("#interestAmount").textContent();
  }

  async getTotalAmountResult() {
    return this.page.locator("#totalAmount").textContent();
  }

  async getErrorMessages() {
    return this.page.locator(".text-danger, .alert, .error").allTextContents();
  }
}
