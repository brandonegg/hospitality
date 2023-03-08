import { chromium } from "@playwright/test";
import * as argon2 from "argon2";

import { prisma } from '../../../src/server/db';


/**
 * Sets up the testing environment
 */
async function globalSetup() {
    //const storagePath = path.resolve(__dirname, 'storageState.json')

    //const sessionToken = '04456e41-ec3b-4edf-92c1-48c14e57cacd2'
    const address = await prisma.address.upsert({
        where: {
            id: 'test_address',
        },
        create: {
            id: 'test_address',
            street: 'Testing Ln.',
            city: 'New York',
            state: 'New York',
            zipCode: 52240,
        },
        update: {},
    })
    
    await prisma.user.upsert({
        where: {
            email: 'e2e@e2e.com'
        },
        create: {
            name: "e2e",
            dateOfBirth: new Date(),
            username: "e2e",
            email: "e2e@e2e.com",
            password: await argon2.hash("password"),
            addressId: address.id,
        },
        update: {},
    })

    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('localhost:3000/login');
    await page.locator("input[name=username]").fill('e2e');
    await page.locator("input[name=password]").fill('password');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('http://localhost:3000/', {waitUntil: 'networkidle'});

    await page.context().storageState({ path: 'playwright/.auth/user.json' });
    await browser.close();
}

export default globalSetup;