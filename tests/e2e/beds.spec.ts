import { expect, test } from "@playwright/test";

import {
  adminTest,
  doctorTest,
  nurseTest,
  patientTest,
} from "./playwright/fixtures";

test.describe("beds > page access", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/beds");
  });

  adminTest("admin can access", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "All Beds" })).toBeVisible();
  });

  patientTest("patient is redirected to dashboard", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Welcome, e2e" })
    ).toBeVisible();
  });
});

test.describe("beds > CRUD operations", () => {
  test.describe("create", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/beds");
    });

    adminTest("with valid inputs", async ({ page }) => {
      await page.getByRole("button", { name: "Add Bed" }).click();
      await page.getByLabel("Room Label").click();
      await page.getByLabel("Room Label").fill("TestRoom");
      await page.getByLabel("Street").click();
      await page.getByLabel("Street").fill("123 Lane");
      await page.getByLabel("Street").press("Tab");
      await page.getByRole("combobox").selectOption("IA");
      await page.getByRole("combobox").press("Tab");
      await page.getByLabel("City").fill("Iowa City");
      await page.getByLabel("City").press("Tab");
      await page.getByLabel("ZIP Code").fill("52240");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(page.getByText("Successfully created a bed!")).toBeVisible();
    });

    adminTest("missing room number", async ({ page }) => {
      await page.getByRole("button", { name: "Add Bed" }).click();
      await page.getByLabel("Street").click();
      await page.getByLabel("Street").fill("123 Lane");
      await page.getByLabel("Street").press("Tab");
      await page.getByRole("combobox").selectOption("IA");
      await page.getByRole("combobox").press("Tab");
      await page.getByLabel("City").fill("Iowa City");
      await page.getByLabel("City").press("Tab");
      await page.getByLabel("ZIP Code").fill("52240");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(page.getByText("Room label is required")).toBeVisible();
    });
  });

  test.describe("edit", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/beds");
    });

    adminTest("with valid new room label", async ({ page }) => {
      await page.getByRole("button", { name: "Edit" }).last().click();
      await page.getByLabel("Room Label").click();
      await page.getByLabel("Room Label").fill("404B");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(page.getByText("Successfully updated bed!")).toBeVisible();
    });

    adminTest("with empty room label", async ({ page }) => {
      await page.getByRole("button", { name: "Edit" }).last().click();
      await page.getByLabel("Room Label").click();
      await page.getByLabel("Room Label").fill("");
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(page.getByText("Room label is required")).toBeVisible();
    });
  });

  test.describe("delete", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/beds");
    });

    adminTest("assigned bed", async ({ page }) => {
      await expect(
        page
          .getByRole("row")
          .filter({ has: page.getByText(/^occupied$/) })
          .first()
          .getByText("Delete")
      ).toBeDisabled();
    });

    adminTest("unassigned bed", async ({ page }) => {
      await page.getByRole("button", { name: "Delete" }).last().click();
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(page.getByText("Successfully deleted bed!")).toBeVisible();
    });
  });
});

test.describe("assign bed functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/beds");
  });

  test.describe("button access", () => {
    adminTest("admins can't assign beds", async ({ page }) => {
      await expect(
        page.getByRole("button", { name: "Assign" }).first()
      ).toBeHidden();
    });

    doctorTest("doctors can assign beds", async ({ page }) => {
      await expect(
        page.getByRole("button", { name: "Assign" }).first()
      ).toBeVisible();
    });

    nurseTest("nurses can assign beds", async ({ page }) => {
      await expect(
        page.getByRole("button", { name: "Assign" }).first()
      ).toBeVisible();
    });
  });

  test.describe("assign patient", () => {
    doctorTest("unoccupied bed", async ({ page }) => {
      await page
        .getByRole("row", { name: /.+ unoccupied.+/ })
        .getByRole("button", { name: "Assign" })
        .last()
        .click();
      await page.getByRole("button", { name: "e2e-patient" }).click();
      await page.getByRole("button", { name: "Assign" }).click();

      await expect(
        page.getByText("Successfully assigned patient!")
      ).toBeVisible();
    });
  });

  test.describe("unassign patient", () => {
    doctorTest("occupied bed", async ({ page }) => {
      await page
        .getByRole("row", { name: /.+ occupied.+/ })
        .getByRole("button", { name: "Assign" })
        .last()
        .click();
      await page.getByTestId("assigned").click();
      await page.getByRole("button", { name: "Unassign" }).click();

      await expect(
        page.getByText("Successfully assigned patient!")
      ).toBeVisible();
    });
  });
});
