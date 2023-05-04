import { expect, test } from "@playwright/test";

import { adminTest, patientTest } from "./playwright/fixtures";

test.describe("tests > page access", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests");
  });

  adminTest("admin can access", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "All Tests" })
    ).toBeVisible();
  });

  patientTest("patient is redirected to dashboard", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Welcome, e2e" })
    ).toBeVisible();
  });
});

test.describe("tests > CRUD operations", () => {
  test.describe("create", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/tests");
    });

    adminTest("with valid inputs", async ({ page }) => {
      await page.getByRole("button", { name: "Add Test" }).click();
      await page.getByLabel("Name").click();
      await page.getByLabel("Name").fill("TestTest");
      await page.getByLabel("Description").click();
      await page.getByLabel("Description").fill("TestTestDescription");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(
        page.getByText("Successfully created a test!")
      ).toBeVisible();
    });

    adminTest("missing name", async ({ page }) => {
      await page.getByRole("button", { name: "Add Test" }).click();
      await page.getByLabel("Description").click();
      await page.getByLabel("Description").fill("TestTestDescription");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(page.getByText("Name is required")).toBeVisible();
    });
  });

  test.describe("update", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/tests");
    });

    adminTest("with valid inputs", async ({ page }) => {
      await page.getByRole("button", { name: "Edit" }).last().click();
      await page.getByLabel("Name").click();
      await page.getByLabel("Name").fill("TestTestUpdated");
      await page.getByLabel("Description").click();
      await page.getByLabel("Description").fill("TestTestDescriptionUpdated");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(
        page.getByText("Successfully updated a test!")
      ).toBeVisible();
    });

    adminTest("missing name", async ({ page }) => {
      await page.getByRole("button", { name: "Edit" }).last().click();
      await page.getByLabel("Name").click();
      await page.getByLabel("Name").fill("");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(page.getByText("Name is required")).toBeVisible();
    });
  });

  test.describe("delete", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/tests");
    });

    adminTest("delete test", async ({ page }) => {
      await page.getByRole("button", { name: "Delete" }).last().click();
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(page.getByText("Successfully deleted test!")).toBeVisible();
    });
  });
});
