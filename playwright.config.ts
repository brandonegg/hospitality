import type { PlaywrightTestOptions, PlaywrightWorkerOptions, Project} from "@playwright/test";
import { defineConfig, devices } from "@playwright/test";
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3000;
const BROWSERS = process.env.BROWSERS ?? '*';

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
export const baseURL = `http://localhost:${PORT}`;

/**
 * Generates the projects based on browsers specified in .env
 *
 * @param browsersStr .env browser str (formatted with commas to separate browsers)
 * @returns project list
 */
function buildProjectsList(browsersStr: string): Project<PlaywrightTestOptions, PlaywrightWorkerOptions>[] | undefined {
  let browsers: string[] = browsersStr.trim().split(',');
  const projects: Project<PlaywrightTestOptions, PlaywrightWorkerOptions>[] = [];

  if (browsersStr.trim() === '*') {
    browsers = ['chromium', 'webkit', 'firefox'];
  }

  if (browsers.includes('chromium')) {
    projects.push({
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    });
  }

  if (browsers.includes('firefox')) {
    projects.push({
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    });
  }

  if (browsers.includes('webkit')) {
    projects.push({
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    });
  }

  return projects;
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  globalSetup: './tests/e2e/setup/globalSetup.ts',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  webServer: {
    command: "npm run dev",
    url: baseURL,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
    env: {
      DATABASE_URL: process.env.DATABASE_URL ?? '',
    },
  },
  use: {
    baseURL,
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },

  /* Configure projects for major browsers */
  projects: buildProjectsList(BROWSERS),

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results/',
});
