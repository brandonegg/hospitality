import { expect, test } from "@playwright/test";
import * as jwt from "jsonwebtoken";

import { env } from "../../src/env.mjs";

const resetToken = jwt.sign({ email: "e2e@e2e.com" }, env.JWT_SECRET, {
  expiresIn: "1h",
});

test.describe("reset password page", () => {
  test.describe("without valid token", () => {
    test("display error message when no token", async ({ page }) => {
      await page.goto("/reset-password");
      await page.getByText(/Token is required/).waitFor();
      await expect(page.getByText(/Token is required/)).toBeVisible();
    });

    test("display error message when token is invalid", async ({ page }) => {
      await page.goto("/reset-password?token=invalidToken");
      await page.getByText(/Invalid token/).waitFor();
      await expect(page.getByText(/Invalid token/)).toBeVisible();
    });
  });

  test.describe("with valid token", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/reset-password?token=${resetToken}`);

      test("has reset password text", async ({ page }) => {
        await expect(page.getByText(/Password Reset/)).toBeVisible();
      });

      test("has password input", async ({ page }) => {
        await expect(
          page.getByRole("textbox", { name: "New Password" })
        ).toBeVisible();
        await expect(
          page.getByRole("textbox", { name: "Confirm Password" })
        ).toBeVisible();
      });

      test("has submit button", async ({ page }) => {
        await expect(
          page.getByRole("button", { name: "Submit New Password" })
        ).toBeVisible();
      });

      test("has error message when submitting empty form", async ({ page }) => {
        await page.click("button:has-text('Submit New Password')");
        await expect(page.getByText(/New Password is required/)).toBeVisible();
        await expect(
          page.getByText(/Confirm Password is required/)
        ).toBeVisible();
      });

      test("has error message when passwords do not match", async ({
        page,
      }) => {
        await page.fill("input[name=newPassword]", "password");
        await page.fill("input[name=confirmPassword]", "password1");
        await page.click("button:has-text('Submit New Password')");
        await expect(page.getByText(/Passwords do not match/)).toBeVisible();
      });

      test("display success message when password is reset", async ({
        page,
      }) => {
        await page.fill("input[name=newPassword]", "password");
        await page.fill("input[name=confirmPassword]", "password");
        await page.click("button:has-text('Submit New Password')");
        await expect(page.getByText(/Password updated/)).toBeVisible();
      });
    });
  });
});
