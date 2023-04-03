import { expect, test } from '@playwright/test';

import { baseURL } from "../../playwright.config";

test.describe('homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has hospitality title', async ({ page }) => {
    await expect(page).toHaveTitle(/Hospitality/);
  });

  test('has hospitality header', async ({ page }) => {
    await expect(page.getByText('Hospitality')).toBeVisible();
  });

});

test.describe('navbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('logged out', () => {
    test('shows login and signup buttons', async ({page}) => {
      await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
    });

    test('hides dashboard link', async ({page}) => {
      await expect(page.getByRole('link', { name: 'Dashboard' })).toBeHidden();
    });
  })

  test.describe('logged in', () => {
    
    test.use({
      storageState: async ({browserName}, use) => {
        await use(`playwright/.auth/${browserName}/user.json`);
      },
    });
    
    test('hide sign up and login buttons', async ({page}) => {
      await page.goto(`${baseURL}/login`);
      await page.locator("input[name=username]").fill("e2e-patient");
      await page.locator("input[name=password]").fill("password");
      const pageLoaded = page.waitForEvent("load");
      await page.getByRole("button", { name: "Login" }).click();
      await pageLoaded;
      await page.goto(`${baseURL}/`, {
        waitUntil: "networkidle",
      });
      await expect(page.getByRole('link', { name: 'Login' })).toBeHidden();
      await expect(page.getByRole('link', { name: 'Sign up' })).toBeHidden();
    });

    test('shows dashboard link', async ({page}) => {
      await page.goto(`${baseURL}/login`);
      await page.locator("input[name=username]").fill("e2e-patient");
      await page.locator("input[name=password]").fill("password");
      const pageLoaded = page.waitForEvent("load");
      await page.getByRole("button", { name: "Login" }).click();
      await pageLoaded;
      await page.goto(`${baseURL}/`, {
        waitUntil: "networkidle",
      });
      await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    });
  })
});