import { expect, test } from "@playwright/test";

import { doctorTest } from "./playwright/fixtures";


test.describe("availability page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/availability', {
        waitUntil: "load",
    });
  });

  test.describe('logged out', () => {
    test('redirect off the page', ({page}) => {
        expect(page.url()).not.toContain('availability');
    });
  })
});
test.describe('logged in', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/availability", {
      waitUntil: "load",
    });
  });
  doctorTest('on the availability page', ({page}) => {
    expect(page.url()).toContain('availability');
  });
  doctorTest("has availability title", async ({ page }) => {
    await expect(page).toHaveTitle(/Set Availability/);
  });

  doctorTest("has back button", async ({ page }) => {
    const back = page.getByText(/Back/);
    await expect(back).toBeVisible();
    await expect(back).toHaveText(/Back/);
  });

  doctorTest("has submit button", async ({ page }) => {
    const submit = page.getByText(/Submit/);
    await expect(submit).toBeVisible();
    await expect(submit).toHaveText(/Submit/);
  });
});
