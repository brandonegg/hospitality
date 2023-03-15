import type { BrowserType} from "@playwright/test";
import { chromium, firefox, webkit } from "@playwright/test";
import * as argon2 from "argon2";

import { baseURL } from "../../../playwright.config";
import { prisma } from '../../../src/server/db';

/**
 * Sets up the testing environment
 */
async function globalSetup() {
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

    //const browsers = [await chromium.launch(), await webkit.launch(), await firefox.launch()];
    const browsers: Record<string, BrowserType> = {
        "chromium": chromium,
        "webkit": webkit,
        "firefox": firefox,
    };

    for (const name in browsers) {
        const browserType: BrowserType | undefined = browsers[name];

        if (!browserType) {
            continue;
        }

        const browser = await browserType.launch();
        const page = await browser.newPage();

        await page.goto(`${baseURL}/login`);
        await page.locator("input[name=username]").fill('e2e');
        await page.locator("input[name=password]").fill('password');
        await page.getByRole('button', { name: 'Login' }).click();
        await page.waitForURL(`${baseURL}/dashboard`, {waitUntil: 'networkidle'});

        await page.context().storageState({ path: `playwright/.auth/${name}/user.json` });
        await browser.close();
    }
}

export default globalSetup;