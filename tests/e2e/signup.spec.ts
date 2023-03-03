import { expect, test } from "@playwright/test";
import { setupServer } from "msw/node";

import { api } from "../../src/utils/api";
import { trpc, trpcMsw } from "../msw/setup";

// const server = setupServer(
//   trpcMsw.user.signup.mutation(async (req, res, ctx) => {
//     return res(
//       ctx.status(200),
//       ctx.data({
//         id: "1",
//         name: "John Doe",
//         username: "johndoe",
//         email: "johndoe@example.com",
//       })
//     );
//   })
// );

test.describe("sign up page", () => {
  // test.beforeAll(() => server.listen());

  // test.afterEach(() => server.resetHandlers());

  // test.afterAll(() => server.close());

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

  test("has back button", async ({ page }) => {
    // Expect the page to contain the Sign Up form
    const back = page.locator("a");
    await expect(back).toBeVisible();
    await expect(back).toHaveText(/Back/);
  });

  test('has "Back" link that redirects to the login page', async ({ page }) => {
    // Expect the page to contain the Sign Up form
    const back = page.locator("a");
    await back.click();
    await expect(page).toHaveURL(/login/);
  });

  test("has signup button", async ({ page }) => {
    // Expect the page to contain the Sign Up form
    const form = page.locator("form");
    const submit = form.locator("button[type=submit]");
    await expect(submit).toBeVisible();
    await expect(submit).toHaveText(/Sign Up/);
  });

  test("has sign up form fields", async ({ page }) => {
    // Expect the page to contain the Sign Up form fields
    const form = page.locator("form");
    const firstName = form.locator("input[name=firstName]");
    const lastName = form.locator("input[name=lastName]");
    const street = form.locator("input[name=street]");
    const city = form.locator("input[name=city]");
    const state = form.locator("select[name=state]");
    const zipCode = form.locator("input[name=zipCode]");
    const dateOfBirth = form.locator("input[name=dateOfBirth]");
    const email = form.locator("input[name=email]");
    const password = form.locator("input[name=password]");
    const confirmPassword = form.locator("input[name=confirmPassword]");
    const submit = form.locator("button[type=submit]");

    await expect(firstName).toBeVisible();
    await expect(lastName).toBeVisible();
    await expect(street).toBeVisible();
    await expect(city).toBeVisible();
    await expect(state).toBeVisible();
    await expect(zipCode).toBeVisible();
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

    const streetError = page.locator("span[id=street-error]");
    await expect(streetError).toBeVisible();
    await expect(streetError).toHaveText(/Street address is required/);

    const cityError = page.locator("span[id=city-error]");
    await expect(cityError).toBeVisible();
    await expect(cityError).toHaveText(/City is required/);

    const stateError = page.locator("span[id=state-error]");
    await expect(stateError).toBeVisible();
    await expect(stateError).toHaveText(/State is required/);

    const zipCodeError = page.locator("span[id=zipCode-error]");
    await expect(zipCodeError).toBeVisible();
    await expect(zipCodeError).toHaveText(/Zip is required/);

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
    const street = form.locator("input[name=street]");
    const city = form.locator("input[name=city]");
    const state = form.locator("select[name=state]");
    const zipCode = form.locator("input[name=zipCode]");
    const dateOfBirth = form.locator("input[name=dateOfBirth]");
    const email = form.locator("input[name=email]");
    const password = form.locator("input[name=password]");
    const confirmPassword = form.locator("input[name=confirmPassword]");
    const submit = form.locator("button[type=submit]");

    await submit.click();

    await firstName.fill("John");
    await lastName.fill("Doe");
    await street.fill("123 Main St");
    await city.fill("New York");
    await state.selectOption("NY");
    await zipCode.fill("12345");
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

  // test("display success message when submitting valid form", async ({
  //   page,
  // }) => {
  //   // Expect the page to display success message when submitting valid form
  //   const form = page.locator("form");
  //   const firstName = form.locator("input[name=firstName]");
  //   const lastName = form.locator("input[name=lastName]");
  //   const street = form.locator("input[name=street]");
  //   const city = form.locator("input[name=city]");
  //   const state = form.locator("select[name=state]");
  //   const zipCode = form.locator("input[name=zipCode]");
  //   const dateOfBirth = form.locator("input[name=dateOfBirth]");
  //   const username = form.locator("input[name=username]");
  //   const email = form.locator("input[name=email]");
  //   const password = form.locator("input[name=password]");
  //   const confirmPassword = form.locator("input[name=confirmPassword]");
  //   const submit = form.locator("button[type=submit]");

  //   await firstName.fill("John");
  //   await lastName.fill("Doe");
  //   await street.fill("123 Main St");
  //   await city.fill("New York");
  //   await state.selectOption("NY");
  //   await zipCode.fill("12345");
  //   await dateOfBirth.fill("2021-01-01");
  //   await username.fill("johndoe");
  //   await email.fill("johndoe@example.com");
  //   await password.fill("12345678");
  //   await confirmPassword.fill("12345678");

  //   await submit.click();

  //   const user = await trpc.user.signup.mutate({
  //     firstName: "John",
  //     lastName: "Doe",
  //     street: "123 Main St",
  //     city: "New York",
  //     state: "NY",
  //     zipCode: "12345",
  //     dateOfBirth: "2021-01-01",
  //     username: "johndoe1",
  //     email: "johndoe1@example.com",
  //     password: "12345678",
  //     confirmPassword: "12345678",
  //   });

  //   const successMessage = page.locator("div[class=alert-success]");
  //   await expect(successMessage).toBeVisible();
  // });
});
