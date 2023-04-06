import { expect, test } from '@playwright/test';

import { patientTest } from './playwright/fixtures'

test.describe('dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard', {
            waitUntil: "load",
        });
    });

    test.describe('logged out', () => {
        test('redirect to login page', ({page}) => {
            expect(page.url()).toContain('login');
        });
    })

    test.describe('logged in', () => {
        patientTest('on the dashboard page', async ({page}) => {
            expect(page.url()).toContain('dashboard');
            await expect(page.getByRole('heading', { name: 'Welcome, e2e' })).toBeVisible();
        });

        patientTest('view dashboard widgets', async ({page}) => {
            await expect(page.getByRole('heading', { name: 'Upcoming Appointments' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Insurance' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Vitals' })).toBeVisible();
        })
    })
});
