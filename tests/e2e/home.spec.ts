import { expect, test } from '@playwright/test';

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
  test('shows login and signup when no user signed in', async ({page}) => {
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
  });

  test('shows Dashboard link when user signed in', async ({page}) => {
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
  });
});