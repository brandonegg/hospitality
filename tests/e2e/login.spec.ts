import { expect, test } from "@playwright/test";

test.describe("login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("has login title", async ({ page }) => {
    await expect(page).toHaveTitle(/Login/);
  });

  test("has login page title", async ({ page }) => {
    // Expect the page to contain the Login text
    const contents = page.locator("h1");
    await expect(contents).toHaveText(/Login/);
  });

  test("has back button", async ({ page }) => {
    const back = page.getByText(/Back/);
    await expect(back).toBeVisible();
    await expect(back).toHaveText(/Back/);
  });

  test('has "Back" link that redirects to the previous page', async ({
    page,
  }) => {
    await page.goto("/", {
      waitUntil: "load",
    });
    await page.goto("/login", {
      waitUntil: "load",
    });
    const back = page.getByText(/Back/);
    await back.click();
    await expect(page).toHaveURL("/");
  });

  test("has forgot password link that redirects to the forgot password page", async ({
    page,
  }) => {
    const forgotPassword = page.getByText(/Forgot Password/);
    await forgotPassword.click();
    await expect(page).toHaveURL("/forgot-password");
  });

  test('has "Sign Up" link that redirects to the sign up page', async ({
    page,
  }) => {
    const signUp = page.getByText(/Sign Up/);
    await signUp.click();
    await expect(page).toHaveURL("/signup");
  });

  test("has login form", async ({ page }) => {
    // Expect the page to contain the Login form
    const form = page.locator("form");
    await expect(form).toBeVisible();
  });

  test("has login form fields", async ({ page }) => {
    // Expect the page to contain the Login form fields
    const username = page.locator("input[name=username]");
    const password = page.locator("input[name=password]");
    await expect(username).toBeVisible();
    await expect(password).toBeVisible();
  });
});
