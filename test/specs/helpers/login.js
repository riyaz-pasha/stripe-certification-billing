import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

const login = async (page) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator("text=Login").click();
  await expect(page).toHaveURL("/login");
  await page.locator('input[name="email"]').fill(faker.internet.email());
  await page.locator('input[name="email"]').press("Enter");
  await expect(page).toHaveURL("/dashboard");
};

export default login;
