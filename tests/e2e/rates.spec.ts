import { expect, test } from "@playwright/test";

import { adminTest, patientTest } from "./playwright/fixtures";

test.describe("rates > page access", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/rates");
  });

  adminTest("admin can access", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "All Rates" })
    ).toBeVisible();
  });

  patientTest("patient is redirected to dashboard", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Welcome, e2e" })
    ).toBeVisible();
  });
});

test.describe("rates > CRUD operations", () => {
  test.describe("create", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/rates");
    });

    adminTest("with valid inputs", async ({ page }) => {
      await page.getByRole("button", { name: "Add Rate" }).click();
      await page.getByLabel("Name").click();
      await page.getByLabel("Name").fill("TestRate");
      await page.getByLabel("Description").click();
      await page.getByLabel("Description").fill("TestRateDescription");
      await page.getByLabel("Price").click();
      await page.getByLabel("Price").fill("100");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(
        page.getByText("Successfully created a rate!")
      ).toBeVisible();
    });

    adminTest("missing name", async ({ page }) => {
      await page.getByRole("button", { name: "Add Rate" }).click();
      await page.getByLabel("Description").click();
      await page.getByLabel("Description").fill("TestRateDescription");
      await page.getByLabel("Price").click();
      await page.getByLabel("Price").fill("100");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(page.getByText("Name is required")).toBeVisible();
    });
  });

  test.describe("update", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/rates");
    });

    adminTest("with valid inputs", async ({ page }) => {
      await page.getByRole("button", { name: "Edit" }).last().click();
      await page.getByLabel("Name").click();
      await page.getByLabel("Name").fill("TestRateUpdated");
      await page.getByLabel("Description").click();
      await page.getByLabel("Description").fill("TestRateDescriptionUpdated");
      await page.getByLabel("Price").click();
      await page.getByLabel("Price").fill("200.1");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(
        page.getByText("Successfully updated a rate!")
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
      await page.goto("/rates");
    });

    adminTest("delete rate", async ({ page }) => {
      await page.getByRole("button", { name: "Delete" }).last().click();
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(page.getByText("Successfully deleted rate!")).toBeVisible();
    });
  });
});
