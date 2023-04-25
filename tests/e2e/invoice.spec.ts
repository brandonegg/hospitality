import { expect, test } from "@playwright/test";

import { adminTest, patientTest } from "./playwright/fixtures";

test.describe("meds > page access", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/invoice");
  });

  adminTest("admin can access", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "All Invoices" })
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
      await page.goto("/invoice");
    });

    adminTest("with valid inputs", async ({ page }) => {
      await page.getByRole("button", { name: "Add Invoice" }).click();
      await page.getByLabel("User").selectOption({ label: "John" });
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(
        page.getByText("Successfully created an invoice!")
      ).toBeVisible();
    });

    adminTest("due date prior to today", async ({ page }) => {
      await page.getByRole("button", { name: "Add Invoice" }).click();
      await page.getByLabel("Due Date").fill("2000-05-25");

      await page.getByRole("button", { name: "Confirm" }).click();
      await expect(
        page.getByText("Invoice date must be in the future.")
      ).toBeVisible();
    });
  });

  test.describe("update", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/invoice");
    });

    adminTest("with valid inputs", async ({ page }) => {
      await page.getByRole("button", { name: "Edit" }).last().click();
      await page.getByLabel("User").selectOption({ label: "Yewande" });
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(
        page.getByText("Successfully updated an invoice!")
      ).toBeVisible();
    });

    adminTest("due date prior to today", async ({ page }) => {
      await page.getByRole("button", { name: "Edit" }).last().click();
      await page.getByLabel("Due Date").fill("2000-05-25");

      await page.getByRole("button", { name: "Confirm" }).click();
      await expect(
        page.getByText("Invoice date must be in the future.")
      ).toBeVisible();
    });
  });

  test.describe("delete", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/invoice");
    });

    adminTest("delete meds", async ({ page }) => {
      await page.getByRole("button", { name: "Delete" }).last().click();
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(
        page.getByText("Successfully deleted invoice!")
      ).toBeVisible();
    });
  });

  test.describe("add bill test", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/invoice");
    });

    adminTest("add bill", async ({ page }) => {
      await page.getByRole("button", { name: "Add Bill" }).last().click();
      await page.getByLabel("Procedure").selectOption({
        label: "Laboratory",
      });
      await page.getByLabel("Quantity").click();
      await page.getByLabel("Quantity").fill("3");

      await page.getByRole("button", { name: "Add" }).click();

      await expect(
        page.getByText("Successfully added to invoice bill!")
      ).toBeVisible();
    });

    // adminTest("negative quantity", async ({ page }) => {
    //   await page.getByRole("button", { name: "Add Bill" }).last().click();
    //   await page.getByLabel("Procedure").selectOption({
    //     label: "Laboratory",
    //   });
    //   await page.getByLabel("Quantity").click();
    //   await page.getByLabel("Quantity").fill("-3");

    //   await page.getByRole("button", { name: "Add" }).click();

    //   await expect(
    //     page.getByText("Quantity must be greater than 0.")
    //   ).toBeVisible();
    // });

    adminTest("missing quantity", async ({ page }) => {
      await page.getByLabel("Quantity").click();
      await page.getByLabel("Quantity").fill("");

      await page.getByRole("button", { name: "Add" }).click();

      await expect(page.getByText("Quantity is required")).toBeVisible();
    });
  });

  test.describe("remove bill test", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/invoice");
    });

    adminTest("remove bill", async ({ page }) => {
      // add bill to remove
      await page.getByRole("button", { name: "Add Bill" }).last().click();
      await page.getByLabel("Procedure").selectOption({
        label: "Laboratory",
      });
      await page.getByLabel("Quantity").click();
      await page.getByLabel("Quantity").fill("3");

      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("button", { name: "Close" }).click();
      // remove the added med
      await page.getByRole("button", { name: "Remove Bill" }).last().click();
      await page
        .getByLabel("Procedure - Name x quantity")
        .selectOption({ label: "Laboratory x 3" });
      await page.getByRole("button", { name: "Remove" }).click();

      await expect(
        page.getByText("Successfully removed from from invoice bill!")
      ).toBeVisible();
    });
  });
});
