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
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows login and signup when no user signed in', async ({page}) => {
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
  });

  /*
  test('shows Dashboard link when user signed in', async ({page}) => {
    const mockSession: Session = {
      expires: "1",
      user: { 
        id: "1", 
        username: "e2e", 
        name: "e2e" 
      },
    };

    jest.mock('next-auth/react', () => ({
      useSession: jest.fn().mockReturnValue(mockSession),
    }));
  
    await expect(page.getByRole('link', { name: 'Login' })).toBeHidden();
    await expect(page.getByRole('link', { name: 'Sign up' })).toBeHidden();
  });
  */
});