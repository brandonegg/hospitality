import { expect, test } from "@playwright/test";

test.describe("sign up page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");
  });

  test("has sign up title", async ({ page }) => {
    await expect(page).toHaveTitle(/Sign Up/);
  });

  test("has sign up page title", async ({ page }) => {
    // Expect the page to contain the Sign Up text
    const contents = page.locator("h1");
    await expect(contents).toHaveText(/Sign Up/);
  });

  test("has sign up form", async ({ page }) => {
    // Expect the page to contain the Sign Up form
    const form = page.locator("form");
    await expect(form).toBeVisible();
  });

  test("has sign up form fields", async ({ page }) => {
    // Expect the page to contain the Sign Up form fields
    const form = page.locator("form");
    const firstName = form.locator("input[name=firstName]");
    const lastName = form.locator("input[name=lastName]");
    const dateOfBirth = form.locator("input[name=dateOfBirth]");
    const email = form.locator("input[name=email]");
    const password = form.locator("input[name=password]");
    const confirmPassword = form.locator("input[name=confirmPassword]");
    const submit = form.locator("button[type=submit]");

    await expect(firstName).toBeVisible();
    await expect(lastName).toBeVisible();
    await expect(dateOfBirth).toBeVisible();
    await expect(email).toBeVisible();
    await expect(password).toBeVisible();
    await expect(confirmPassword).toBeVisible();
    await expect(submit).toBeVisible();
  });

  test("display error message when submitting empty form", async ({ page }) => {
    // Expect the page to display error message when submitting empty form
    const form = page.locator("form");
    const submit = form.locator("button[type=submit]");
    await submit.click();

    const firstNameError = page.locator("span[id=firstName-error]");
    await expect(firstNameError).toBeVisible();
    await expect(firstNameError).toHaveText(/First name is required/);

    const lastNameError = page.locator("span[id=lastName-error]");
    await expect(lastNameError).toBeVisible();
    await expect(lastNameError).toHaveText(/Last name is required/);

    const dateOfBirthError = page.locator("span[id=dateOfBirth-error]");
    await expect(dateOfBirthError).toBeVisible();
    await expect(dateOfBirthError).toHaveText(/Date of birth is required/);

    const emailError = page.locator("span[id=email-error]");
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText(/Email is required/);

    const passwordError = page.locator("span[id=password-error]");
    await expect(passwordError).toBeVisible();
    await expect(passwordError).toHaveText(/Password is required/);

    const confirmPasswordError = page.locator("span[id=confirmPassword-error]");
    await expect(confirmPasswordError).toBeVisible();
    await expect(confirmPasswordError).toHaveText(
      /Confirm password is required/
    );
  });

  test("display error message when submitting invalid form", async ({
    page,
  }) => {
    // Expect the page to display error message when submitting invalid form
    const form = page.locator("form");
    const firstName = form.locator("input[name=firstName]");
    const lastName = form.locator("input[name=lastName]");
    const dateOfBirth = form.locator("input[name=dateOfBirth]");
    const email = form.locator("input[name=email]");
    const password = form.locator("input[name=password]");
    const confirmPassword = form.locator("input[name=confirmPassword]");
    const submit = form.locator("button[type=submit]");

    await submit.click();

    await firstName.fill("John");
    await lastName.fill("Doe");
    await dateOfBirth.fill("2021-01-01");
    await email.fill("john.doe");
    await password.fill("1234567");
    await confirmPassword.fill("12345678");

    const emailError = page.locator("span[id=email-error]");
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText(/Email is invalid/);

    const passwordError = page.locator("span[id=password-error]");
    await expect(passwordError).toBeVisible();
    await expect(passwordError).toHaveText(
      /Password must be at least 8 characters/
    );

    const confirmPasswordError = page.locator("span[id=confirmPassword-error]");
    await expect(confirmPasswordError).toBeVisible();
    await expect(confirmPasswordError).toHaveText(/Passwords do not match/);
  });
});
