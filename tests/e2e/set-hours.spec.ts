import { expect, test } from "@playwright/test";

import { adminTest } from "./playwright/fixtures";

test.describe("setHours page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/adminHourSetting", {
      waitUntil: "load",
    });
  });

  test.describe("logged out", () => {
    test("redirect off the page", ({ page }) => {
      expect(page.url()).not.toContain("adminHourSetting");
    });
  });
});
test.describe("logged in", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/adminHourSetting", {
      waitUntil: "load",
    });
  });
  adminTest("on the set hours page", ({ page }) => {
    expect(page.url()).toContain("adminHourSetting");
  });
  adminTest("has set hours title", async ({ page }) => {
    await expect(page).toHaveTitle(/Set Hours/);
  });

  adminTest("has back button", async ({ page }) => {
    const back = page.getByText(/Back/);
    await expect(back).toBeVisible();
    await expect(back).toHaveText(/Back/);
  });

  adminTest("has submit button", async ({ page }) => {
    const submit = page.getByText(/Submit/);
    await expect(submit).toBeVisible();
    await expect(submit).toHaveText(/Submit/);
  });
});
