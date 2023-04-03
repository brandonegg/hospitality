import { expect, test } from '@playwright/test';

import { patientTest } from './playwright/fixtures';

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
    patientTest('hide sign up and login buttons', async ({page}) => {

      await expect(page.getByRole('link', { name: 'Login' })).toBeHidden();
      await expect(page.getByRole('link', { name: 'Sign up' })).toBeHidden();
    });

    patientTest('shows dashboard link', async ({page}) => {
      await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    });
  })
});
