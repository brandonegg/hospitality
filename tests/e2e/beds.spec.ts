import { test } from '@playwright/test';

test.describe('beds > page access', () => {
    test('admin can access', () => {
        // TODO: navigate to beds page, verify they can see the delete button
    });

    test('patient cant access', () => {
        // TODO: navigate to beds page, verify they are redirected to dashboard
    });
});

test.describe('beds > CRUD operations', () => {
    test.describe('create', () => {
        test('with valid inputs', () => {
            // TODO: Enter valid inputs, verify bed is created
        });

        test('missing room number', () => {
            // TODO: Enter valid address but missing room, verify field has error
        });
    });

    test.describe('edit', () => {
        test('with valid new room label', () => {
            // TODO: Enter valid room label, verify bed is created
        });

        test('with empty room label', () => {
            // TODO: clear the room label, try to update
        });
    });

    test.describe('delete', () => {
        test('unassigned bed', () => {
            // TODO: Admin presses delete button and bed deletes successfully
        });

        test('assigned bed', () => {
            // TODO: Admin presses delete button and bed is not deleted
        });
    });
});
