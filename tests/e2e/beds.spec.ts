import { expect, test } from '@playwright/test';

import { adminTest, patientTest } from './playwright/fixtures';

test.describe('beds > page access', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/beds');
    });

    adminTest('admin can access', async ({page}) => {
        await expect(page.getByRole('heading', { name: 'All Beds' })).toBeVisible();
    });

    patientTest('patient is redirected to dashboard', async ({page}) => {
        await expect(page.getByRole('heading', { name: 'Welcome, e2e' })).toBeVisible();
    });
});

test.describe('beds > CRUD operations', () => {
    test.describe('create', () => {
        test.beforeEach(async ({page}) => {
            await page.goto('/beds');
        });

        adminTest('with valid inputs', async ({page}) => {
            await page.getByRole('button', { name: 'Add Bed' }).click();
            await page.getByLabel('Room Label').click();
            await page.getByLabel('Room Label').fill('TestRoom');
            await page.getByLabel('Street').click();
            await page.getByLabel('Street').fill('123 Lane');
            await page.getByLabel('Street').press('Tab');
            await page.getByRole('combobox').selectOption('IA');
            await page.getByRole('combobox').press('Tab');
            await page.getByLabel('City').fill('Iowa City');
            await page.getByLabel('City').press('Tab');
            await page.getByLabel('ZIP Code').fill('52240');
            await page.getByRole('button', { name: 'Confirm' }).click();

            await expect(page.getByText('Successfully created a bed!')).toBeVisible();
        });

        adminTest('missing room number', async ({page}) => {
            await page.getByRole('button', { name: 'Add Bed' }).click();
            await page.getByLabel('Street').click();
            await page.getByLabel('Street').fill('123 Lane');
            await page.getByLabel('Street').press('Tab');
            await page.getByRole('combobox').selectOption('IA');
            await page.getByRole('combobox').press('Tab');
            await page.getByLabel('City').fill('Iowa City');
            await page.getByLabel('City').press('Tab');
            await page.getByLabel('ZIP Code').fill('52240');
            await page.getByRole('button', { name: 'Confirm' }).click();

            await expect(page.getByText('Room label is required')).toBeVisible();
        });
    });

    test.describe('edit', () => {
        test.beforeEach(async ({page}) => {
            await page.goto('/beds');
        });

        adminTest('with valid new room label', async ({page}) => {
            await page.getByRole('row', { name: '200 Hawkins Dr. Iowa City, Iowa 52242 405 unoccupied No patient assigned Edit Delete' }).getByRole('button', { name: 'Edit' }).click();
            await page.getByLabel('Room Label').click();
            await page.getByLabel('Room Label').fill('404B');
            await page.getByRole('button', { name: 'Confirm' }).click();

            await expect(page.getByText('Successfully updated bed!')).toBeVisible();
        });

        adminTest('with empty room label', async ({page}) => {
            await page.getByRole('row', { name: '200 Hawkins Dr. Iowa City, Iowa 52242 405 unoccupied No patient assigned Edit Delete' }).getByRole('button', { name: 'Edit' }).click();
            await page.getByLabel('Room Label').click();
            await page.getByLabel('Room Label').fill('');
            await page.getByRole('button', { name: 'Confirm' }).click();

            await expect(page.getByText('Room label is required')).toBeVisible();
        });
    });

    test.describe('delete', () => {
        test.beforeEach(async ({page}) => {
            await page.goto('/beds');
        });

        adminTest('assigned bed', async ({page}) => {
            await expect(page.getByRole('row', { name: '200 Hawkins Dr. Iowa City, Iowa 52242 401A occupied e2e Edit Delete' }).getByRole('button', { name: 'Delete' })).toBeDisabled();
        });

        adminTest('unassigned bed', async ({page}) => {
            await page.getByRole('row', { name: '200 Hawkins Dr. Iowa City, Iowa 52242 1100 unoccupied No patient assigned Edit Delete' }).getByRole('button', { name: 'Delete' }).click();
            await page.getByRole('button', { name: 'Confirm' }).click();

            await expect(page.getByText('Successfully deleted bed!')).toBeVisible();
        });
    });
});
