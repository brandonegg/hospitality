import { expect, test } from "@playwright/test";

import { patientTest } from "./playwright/fixtures";


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
  patientTest('on the appointment page', ({page}) => {
    expect(page.url()).toContain('appointment');
  });
  patientTest("has appointment title", async ({ page }) => {
    await expect(page).toHaveTitle(/Set Appointment/);
  });

  patientTest("has back button", async ({ page }) => {
    const back = page.getByText(/Back/);
    await expect(back).toBeVisible();
    await expect(back).toHaveText(/Back/);
  });

  patientTest("has submit button", async ({ page }) => {
    const submit = page.getByText(/Submit/);
    await expect(submit).toBeVisible();
    await expect(submit).toHaveText(/Submit/);
  });
});
