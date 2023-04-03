import { expect, test } from "@playwright/test";

import { baseURL } from "../../playwright.config";

import { adminTest, patientTest } from "./playwright/fixtures";


test.describe("redirect if users is not admin", () => {
  patientTest('redirects to "/dashboard" if user is not admin', async ({ page }) => {
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
    await page.goto(`${baseURL}/users`, {
      waitUntil: "domcontentloaded",
    });
  });

  adminTest("has users text", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "All Users" })
    ).toBeVisible();
  });

  adminTest("has users table", async ({ page }) => {
    await expect(page.getByRole("table")).toBeVisible();
  });

  adminTest("has 'Add User' button", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Add User" })).toBeVisible();
  });

  adminTest("has 'Edit' button", async ({ page }) => {
    await expect(page.getByTestId("edit-0")).toBeVisible();
  });

  adminTest("has 'Delete' button", async ({ page }) => {
    await expect(page.getByTestId("delete-0")).toBeVisible();
  });

  test.describe("create user", () => {
    adminTest('dipslays "Add User" modal when "Add User" button is clicked', async ({
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
    adminTest('dipslays "Edit User" modal when "Edit" button is clicked', async ({
      page,
    }) => {
      await page.getByTestId("edit-0").click();
      await expect(page.getByText("Edit User")).toBeVisible();

      await expect(page.locator("input[name=name]")).toBeVisible();
      await expect(page.locator("select[name=role]")).toBeVisible();
    });
  });

  test.describe("delete user", () => {
    adminTest('dipslays "Delete User" modal when "Delete" button is clicked', async ({
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
