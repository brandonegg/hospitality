import { expect, test } from '@playwright/test';

import { adminTest, patientTest } from './playwright/fixtures';

test.describe('beds > page access', () => {
    adminTest('admin can access', async ({page}) => {
        await page.goto('/beds');
        await expect(page.getByRole('heading', { name: 'All Beds' })).toBeVisible();
    });

    patientTest('patient is redirected to dashboard', async ({page}) => {
        await page.goto('/beds');
        await expect(page.getByRole('heading', { name: 'Welcome, e2e' })).toBeVisible();
    });
});

test.describe('beds > CRUD operations', () => {
    test.describe('create', () => {
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

        test.skip('missing room number', async ({page}) => {
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
        test.skip('with valid new room label', async ({page}) => {
            await page.getByRole('row', { name: '200 Hawkins Dr. Iowa City, Iowa 52242 401A occupied e2e Edit Delete' }).getByRole('button', { name: 'Edit' }).click();
        });

        test.skip('with empty room label', () => {
            // TODO: clear the room label, try to update
        });
    });

    test.describe('delete', () => {
        test.skip('unassigned bed', () => {
            // TODO: Admin presses delete button and bed deletes successfully
        });

        test.skip('assigned bed', () => {
            // TODO: Admin presses delete button and bed is not deleted
        });
    });
});
