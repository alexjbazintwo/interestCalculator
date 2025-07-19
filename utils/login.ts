import { Page } from "@playwright/test";

export const login = async (page: Page) => {
  await page.goto("http://3.8.242.61/");
  await page.getByRole("button", { name: "Login" }).click();
  await page
    .getByRole("textbox", { name: "Email" })
    .fill("alexjbazin@gmail.com");
  await page.getByRole("textbox", { name: "Password" }).fill("Bilingual123!");
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForLoadState("networkidle");
}
