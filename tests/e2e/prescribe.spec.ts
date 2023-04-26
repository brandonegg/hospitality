import { expect, test } from "@playwright/test";

import { doctorTest, patientTest } from "./playwright/fixtures";

test.describe("prescribe > page access", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/prescribe");
  });

  doctorTest("admin can access", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "All Prescriptions" })
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
      await page.goto("/prescribe");
    });

    doctorTest("with valid inputs", async ({ page }) => {
      await page.getByRole("button", { name: "Add Prescription" }).click();
      await page.getByLabel("User").selectOption({ label: "Yewande" });
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(
        page.getByText("Successfully created a prescription!")
      ).toBeVisible();
    });
  });

  test.describe("update", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/prescribe");
    });

    doctorTest("with valid inputs", async ({ page }) => {
      await page.getByRole("button", { name: "Edit" }).last().click();
      await page.getByLabel("User").selectOption({ label: "Yewande" });
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(
        page.getByText("Successfully updated a prescription!")
      ).toBeVisible();
    });
  });

  test.describe("delete", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/prescribe");
    });

    doctorTest("delete meds", async ({ page }) => {
      await page.getByRole("button", { name: "Delete" }).last().click();
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(
        page.getByText("Successfully deleted prescription!")
      ).toBeVisible();
    });
  });

  test.describe("add medication test", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/prescribe");
    });

    doctorTest("add medication", async ({ page }) => {
      await page.getByRole("button", { name: "Add Medication" }).last().click();
      await page.getByLabel("Medication").selectOption({
        label: "Ibuprofen",
      });
      await page.getByLabel("Dosage (Min: 300 mg, Max: 800 mg)").click();
      await page.getByLabel("Dosage (Min: 300 mg, Max: 800 mg)").fill("350");

      await page.getByRole("button", { name: "Add" }).click();

      await expect(
        page.getByText("Successfully added medication to prescription!")
      ).toBeVisible();
    });

    doctorTest("missing dosage", async ({ page }) => {
      await page.getByRole("button", { name: "Add Medication" }).last().click();
      await page.getByLabel("Medication").selectOption({
        label: "Ibuprofen",
      });
      await page.getByLabel("Dosage (Min: 300 mg, Max: 800 mg)").click();
      await page.getByLabel("Dosage (Min: 300 mg, Max: 800 mg)").fill("");
      await page.getByRole("button", { name: "Add" }).click();

      await expect(page.getByText("Dosage is required")).toBeVisible();
    });

    doctorTest("below minimum dosage", async ({ page }) => {
      await page.getByRole("button", { name: "Add Medication" }).last().click();
      await page.getByLabel("Medication").selectOption({
        label: "Ibuprofen",
      });
      await page.getByLabel("Dosage (Min: 300 mg, Max: 800 mg)").click();
      await page.getByLabel("Dosage (Min: 300 mg, Max: 800 mg)").fill("200");
      await page.getByRole("button", { name: "Add" }).click();

      await expect(
        page.getByText(
          "Dosage is lower than the minimum dosage set by admin: 300 mg."
        )
      ).toBeVisible();
    });

    doctorTest("above maximum dosage", async ({ page }) => {
      await page.getByRole("button", { name: "Add Medication" }).last().click();
      await page.getByLabel("Medication").selectOption({
        label: "Ibuprofen",
      });
      await page.getByLabel("Dosage (Min: 300 mg, Max: 800 mg)").click();
      await page.getByLabel("Dosage (Min: 300 mg, Max: 800 mg)").fill("1000");
      await page.getByRole("button", { name: "Add" }).click();

      await expect(
        page.getByText(
          "Dosage is higher than the maximum dosage set by admin: 800 mg."
        )
      ).toBeVisible();
    });
  });

  test.describe("remove medication test", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/prescribe");
    });

    doctorTest("remove medication", async ({ page }) => {
      // add med to remove
      await page.getByRole("button", { name: "Add Medication" }).last().click();
      await page.getByLabel("Medication").selectOption({
        label: "Ibuprofen",
      });
      await page.getByLabel("Dosage (Min: 300 mg, Max: 800 mg)").click();
      await page.getByLabel("Dosage (Min: 300 mg, Max: 800 mg)").fill("350");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("button", { name: "Close" }).click();

      // remove the added med
      await page
        .getByRole("button", { name: "Remove Medication" })
        .last()
        .click();
      await page
        .getByLabel("Medication - Name x dosage")
        .selectOption({ label: "Ibuprofen x 350 mg" });
      await page.getByRole("button", { name: "Remove" }).click();

      await expect(
        page.getByText("Successfully removed medication from prescription!")
      ).toBeVisible();
    });
  });
});
