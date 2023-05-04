import { expect, test } from "@playwright/test";

import { doctorTest, patientTest } from "./playwright/fixtures";

test.describe("lab-tests > page access", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/lab-tests");
  });

  doctorTest("doctor can access", async ({ page }) => {
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

test.describe("lab-tests > CRUD operations", () => {
  test.describe("create", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/lab-tests");
    });

    doctorTest("with valid inputs", async ({ page }) => {
      await page.getByRole("button", { name: "Add Test" }).click();
      await page.locator("select#userId").selectOption({ index: 0 });
      await page.locator("select#testId").selectOption({ index: 0 });
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(
        page.getByText("Successfully created a test!")
      ).toBeVisible();
    });
  });

  test.describe("update", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/lab-tests");
    });

    doctorTest("with valid inputs", async ({ page }) => {
      await page.getByRole("button", { name: "Edit" }).last().click();
      await page.locator("select#userId").selectOption({ index: 0 });
      await page.locator("select#testId").selectOption({ index: 0 });
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(
        page.getByText("Successfully updated a test!")
      ).toBeVisible();
    });

    doctorTest("with result", async ({ page }) => {
      await page.getByRole("button", { name: "Edit" }).last().click();
      await page.locator("select#userId").selectOption({ index: 0 });
      await page.locator("select#testId").selectOption({ index: 0 });
      await page.getByLabel("Result").fill("result");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(
        page.getByText("Successfully updated a test!")
      ).toBeVisible();
    });
  });

  test.describe("delete", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/lab-tests");
    });

    doctorTest("delete test", async ({ page }) => {
      await page.getByRole("button", { name: "Delete" }).last().click();
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(page.getByText("Successfully deleted test!")).toBeVisible();
    });
  });
});
