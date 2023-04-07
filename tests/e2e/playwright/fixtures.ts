// playwright/fixtures.ts
import fs from 'fs';
import path from 'path';

import { test as baseTest } from '@playwright/test';

import { baseURL } from "../../../playwright.config";

export * from '@playwright/test';

/**
 * Fixture for writing tests within the browser context of a logged in patient.
 * Do not use this fixture if your test modifies server-side state!
 */
export const adminTest = baseTest.extend<object, { workerStorageState: string }>({
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  workerStorageState: [async ({ browser }, use, workerInfo) => {
    const id = workerInfo.workerIndex;
    const fileName = path.resolve(workerInfo.project.outputDir, `.auth/admin/${id}.json`);

    if (fs.existsSync(fileName)) {
      await use(fileName); // Reuse existing authentication state if any.
      return;
    }

    // authenticate in a clean environment by unsetting storage state.
    const page = await browser.newPage({ storageState: undefined });

    // Login as admin.
    await page.goto(`${baseURL}/login`);
    await page.locator("input[name=username]").fill("e2e");
    await page.locator("input[name=password]").fill("password");
    const pageLoaded = page.waitForEvent("load");
    await page.getByRole("button", { name: "Login" }).click();
    await pageLoaded;

    // Save state
    await page.context().storageState({ path: fileName });
    await page.close();
    await use(fileName);
  }, { scope: 'worker' }],
});

export const patientTest = baseTest.extend<object, { workerStorageState: string }>({
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  workerStorageState: [async ({ browser }, use, workerInfo) => {
    const id = workerInfo.workerIndex;
    const fileName = path.resolve(workerInfo.project.outputDir, `.auth/patient/${id}.json`);

    if (fs.existsSync(fileName)) {
      await use(fileName); // Reuse existing authentication state if any.
      return;
    }

    // authenticate in a clean environment by unsetting storage state.
    const page = await browser.newPage({ storageState: undefined });

    // Login as patient.
    await page.goto(`${baseURL}/login`);
    await page.locator("input[name=username]").fill("e2e-patient");
    await page.locator("input[name=password]").fill("password");
    const pageLoaded = page.waitForEvent("load");
    await page.getByRole("button", { name: "Login" }).click();
    await pageLoaded;

    // Save state
    await page.context().storageState({ path: fileName });
    await page.close();
    await use(fileName);
  }, { scope: 'worker' }],
});

export const doctorTest = baseTest.extend<object, { workerStorageState: string }>({
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  workerStorageState: [async ({ browser }, use, workerInfo) => {
    const id = workerInfo.workerIndex;
    const fileName = path.resolve(workerInfo.project.outputDir, `.auth/doctor/${id}.json`);

    if (fs.existsSync(fileName)) {
      await use(fileName); // Reuse existing authentication state if any.
      return;
    }

    // authenticate in a clean environment by unsetting storage state.
    const page = await browser.newPage({ storageState: undefined });

    // Login as doctor.
    await page.goto(`${baseURL}/login`);
    await page.locator("input[name=username]").fill("e2e-doctor");
    await page.locator("input[name=password]").fill("password");
    const pageLoaded = page.waitForEvent("load");
    await page.getByRole("button", { name: "Login" }).click();
    await pageLoaded;

    // Save state
    await page.context().storageState({ path: fileName });
    await page.close();
    await use(fileName);
  }, { scope: 'worker' }],
});
