import { Page } from "@playwright/test";

const email: string = "FILL IN YOUR EMAIL HERE";
const password: string = "FILL IN YOUR PASSWORD HERE";

export const login = async (page: Page) => {
  await page.goto("http://3.8.242.61/");
  await page.getByRole("button", { name: "Login" }).click();
  await page
    .getByRole("textbox", { name: "Email" })
    .fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForLoadState("networkidle");
}
