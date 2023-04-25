import { expect, test } from "@playwright/test";

import { adminTest, patientTest } from "./playwright/fixtures";

test.describe("meds > page access", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/meds");
  });

  adminTest("admin can access", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "All Medications" })
    ).toBeVisible();
  });

  patientTest("patient is redirected to dashboard", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Welcome, e2e" })
    ).toBeVisible();
  });
});

test.describe("meds > CRUD operations", () => {
  test.describe("create", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/meds");
    });

    adminTest("with valid inputs", async ({ page }) => {
      await page.getByRole("button", { name: "Add Medication" }).click();
      await page.getByLabel("Name").click();
      await page.getByLabel("Name").fill("TestMedication");
      await page.getByLabel("Minimum Dosage").click();
      await page.getByLabel("Minimum Dosage").fill("20");
      await page.getByLabel("Maximum Dosage").click();
      await page.getByLabel("Maximum Dosage").fill("40");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(
        page.getByText("Successfully created a medication!")
      ).toBeVisible();
    });

    adminTest("missing name", async ({ page }) => {
      await page.getByRole("button", { name: "Add Medication" }).click();
      await page.getByLabel("Minimum Dosage").click();
      await page.getByLabel("Minimum Dosage").fill("20");
      await page.getByLabel("Maximum Dosage").click();
      await page.getByLabel("Maximum Dosage").fill("40");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(page.getByText("Name is required")).toBeVisible();
    });

    adminTest("missing min dosage", async ({ page }) => {
      await page.getByRole("button", { name: "Add Medication" }).click();
      await page.getByLabel("Name").click();
      await page.getByLabel("Name").fill("TestMedication");
      await page.getByLabel("Maximum Dosage").click();
      await page.getByLabel("Maximum Dosage").fill("40");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(page.getByText("Minimum Dosage is required")).toBeVisible();
    });

    adminTest("missing max dosage", async ({ page }) => {
      await page.getByRole("button", { name: "Add Medication" }).click();
      await page.getByLabel("Name").click();
      await page.getByLabel("Name").fill("TestMedication");
      await page.getByLabel("Minimum Dosage").click();
      await page.getByLabel("Minimum Dosage").fill("20");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(page.getByText("Maximum Dosage is required")).toBeVisible();
    });
  });

  test.describe("update", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/meds");
    });

    adminTest("with valid inputs", async ({ page }) => {
      await page.getByRole("button", { name: "Add Medication" }).click();
      await page.getByLabel("Name").click();
      await page.getByLabel("Name").fill("TestMedicationEdit");
      await page.getByLabel("Minimum Dosage").click();
      await page.getByLabel("Minimum Dosage").fill("30");
      await page.getByLabel("Maximum Dosage").click();
      await page.getByLabel("Maximum Dosage").fill("50");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(
        page.getByText("Successfully updated a medication!")
      ).toBeVisible();
    });

    adminTest("missing name", async ({ page }) => {
      await page.getByRole("button", { name: "Edit" }).last().click();
      await page.getByLabel("Name").click();
      await page.getByLabel("Name").fill("");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(page.getByText("Name is required")).toBeVisible();
    });

    adminTest("missing min dosage", async ({ page }) => {
      await page.getByRole("button", { name: "Edit" }).last().click();
      await page.getByLabel("Minimum Dosage").click();
      await page.getByLabel("Minimum Dosage").fill("");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(page.getByText("Minimum Dosage is required")).toBeVisible();
    });

    adminTest("missing max dosage", async ({ page }) => {
      await page.getByRole("button", { name: "Edit" }).last().click();
      await page.getByLabel("Maximum Dosage").click();
      await page.getByLabel("Maximum Dosage").fill("");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(page.getByText("Maximum Dosage is required")).toBeVisible();
    });
  });

  test.describe("delete", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/meds");
    });

    adminTest("delete meds", async ({ page }) => {
      await page.getByRole("button", { name: "Delete" }).last().click();
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(
        page.getByText("Successfully deleted medication!")
      ).toBeVisible();
    });
  });
});
