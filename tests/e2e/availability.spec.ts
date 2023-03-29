import { expect, test } from "@playwright/test";

test.describe("availability page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/availability");
  });

  test("has availability title", async ({ page }) => {
    await expect(page).toHaveTitle(/Set Availability/);
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

  /** test('has "Back" link that redirects to the home page', async ({ page }) => {
    const back = page.getByText(/Back/);
    await back.click();
    await expect(page).toHaveURL("/");
  });
  */ //add this functionality later, see login.tsx and ctrl f back
});
