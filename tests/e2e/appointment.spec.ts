import { expect, test } from "@playwright/test";

import { baseURL } from "../../playwright.config";


test.describe("appointment page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/appointment', {
        waitUntil: "load",
    });
  });

  test.describe('logged out', () => {
    test('redirect off the page', ({page}) => {
        expect(page.url()).not.toContain('appointment');
    });
  })
});
test.describe('logged in', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/login`);
    await page.locator("input[name=username]").fill("e2e-patient");
    await page.locator("input[name=password]").fill("password");
    const pageLoaded = page.waitForEvent("load");
    await page.getByRole("button", { name: "Login" }).click();
    await pageLoaded;
    await page.goto(`${baseURL}/`, {
      waitUntil: "networkidle",
    });
    await page.goto("/appointment", {
      waitUntil: "load",
    });
  });
  test.use({
      storageState: async ({browserName}, use) => {
          await use(`playwright/.auth/${browserName}/user.json`);
      },
  });
  test('on the appointment page', ({page}) => {
    expect(page.url()).toContain('appointment');
  });
  test("has appointment title", async ({ page }) => {
    await expect(page).toHaveTitle(/Set Appointment/);
  });

  test("has back button", async ({ page }) => {
    const back = page.getByText(/Back/);
    await expect(back).toBeVisible();
    await expect(back).toHaveText(/Back/);
  });

  test("has submit button", async ({ page }) => {
    const submit = page.getByText(/Submit/);
    await expect(submit).toBeVisible();
    await expect(submit).toHaveText(/Submit/);
  });
});
