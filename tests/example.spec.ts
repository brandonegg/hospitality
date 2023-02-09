import { expect, test } from '@playwright/test';

test.describe('demo app test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has demo page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Create T3 App/);
  });

  test('has example page title', async ({ page }) => {
    // Expect the page to contact the Create T3 App template text
    const contents = page.locator('h1');
    await expect(contents).toHaveText(/Create T3 App/);
  });
});
