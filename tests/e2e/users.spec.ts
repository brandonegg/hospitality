import { expect, test } from "@playwright/test";

import { baseURL } from "../../playwright.config";

test.describe("redirect if users is not admin", () => {
  test('redirects to "/dashboard" if user is not admin', async ({ page }) => {
    await page.goto(`${baseURL}/login`);
    await page.locator("input[name=username]").fill("e2e-patient");
    await page.locator("input[name=password]").fill("password");
    const pageLoaded = page.waitForEvent("load");
    await page.getByRole("button", { name: "Login" }).click();
    await pageLoaded;
    await page.goto(`${baseURL}/`, {
      waitUntil: "networkidle",
    });

    await page.goto("/users", {
      waitUntil: "load",
    });

    await expect(page).toHaveURL(`${baseURL}/dashboard`);
  });

  test('redirects to "/" if user is not logged in', async ({ page }) => {
    await page.goto("/users", {
      waitUntil: "load",
    });

    await expect(page).toHaveURL(`${baseURL}/login`);
  });
});

test.describe("users page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/login`);
    await page.locator("input[name=username]").fill("e2e");
    await page.locator("input[name=password]").fill("password");
    const pageLoaded = page.waitForEvent("load");
    await page.getByRole("button", { name: "Login" }).click();
    await pageLoaded;
    await page.goto(`${baseURL}/`, {
      waitUntil: "networkidle",
    });

    await page.goto("/users", {
      waitUntil: "load",
    });
  });

  test("has users text", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "All Users" })
    ).toBeVisible();
  });

  test("has users table", async ({ page }) => {
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("has 'Add User' button", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Add User" })).toBeVisible();
  });

  test("has 'Edit' button", async ({ page }) => {
    await expect(page.getByTestId("edit-0")).toBeVisible();
  });

  test("has 'Delete' button", async ({ page }) => {
    await expect(page.getByTestId("delete-0")).toBeVisible();
  });

  test.describe("create user", () => {
    test('dipslays "Add User" modal when "Add User" button is clicked', async ({
      page,
    }) => {
      await page.click("text=Add User");
      await expect(page.getByText("Create User")).toBeVisible();

      await expect(page.locator("input[name=firstName]")).toBeVisible();
      await expect(page.locator("input[name=lastName]")).toBeVisible();
      await expect(page.locator("select[name=role]")).toBeVisible();
      await expect(page.locator("input[name=dateOfBirth]")).toBeVisible();
      await expect(page.locator("input[name=username]")).toBeVisible();
      await expect(page.locator("input[name=email]")).toBeVisible();
      await expect(page.locator("input[name=password]")).toBeVisible();
    });
  });

  test.describe("edit user", () => {
    test('dipslays "Edit User" modal when "Edit" button is clicked', async ({
      page,
    }) => {
      await page.getByTestId("edit-0").click();
      await expect(page.getByText("Edit User")).toBeVisible();

      await expect(page.locator("input[name=name]")).toBeVisible();
      await expect(page.locator("select[name=role]")).toBeVisible();
    });
  });

  test.describe("delete user", () => {
    test('dipslays "Delete User" modal when "Delete" button is clicked', async ({
      page,
    }) => {
      await page.getByTestId("delete-0").click();
      await expect(page.getByText("Delete User")).toBeVisible();

      await expect(page.getByText("Name:")).toBeVisible();
      await expect(page.getByText("Email:")).toBeVisible();
      await expect(page.getByText("Date of Birth:")).toBeVisible();
      await expect(page.getByText("Role:")).toBeVisible();
    });
  });
});
