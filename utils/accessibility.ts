import { Page } from "@playwright/test";
import axe from "axe-core";

export async function checkA11y(page: Page) {
  await page.addScriptTag({ path: require.resolve("axe-core") });
  const results = await page.evaluate(async () => {
    return await (window as any).axe.run();
  });
  if (results.violations.length > 0) {
    console.warn("Accessibility Violations:", results.violations);
  }
  return results;
}
