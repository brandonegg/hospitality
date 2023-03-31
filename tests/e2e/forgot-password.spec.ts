import { expect, test } from "@playwright/test";

test.describe("forgot password page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forgot-password");
  });

  test("has forgot password text", async ({ page }) => {
    await expect(page.getByText(/Can't Sign In/)).toBeVisible();
  });

  test("has email input", async ({ page }) => {
    await expect(
      page.getByRole("textbox", { name: "Email Address" })
    ).toBeVisible();
  });

  test("has submit button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Send me reset instructions" })
    ).toBeVisible();
  });
});
