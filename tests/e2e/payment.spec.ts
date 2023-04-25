import { expect, test } from "@playwright/test";

import { prisma } from "../../src/server/db";

import { patientTest } from "./playwright/fixtures";

test.describe("patient payments", () => {
  test.beforeEach(async ({}) => {
    // Seed the DB with a test user with invoice
    const currentDate = new Date();
    const rate = await prisma.rate.findUnique({
      where: {
        id: "test-pharmacy-rate",
      },
    });

    if (!rate) {
      throw new Error(
        "Unable to find the test pharmacy rate, this should be added in globalSetup.ts"
      );
    }

    const testInvoice = await prisma.invoice.upsert({
      where: {
        id: "test-payment-invoice",
      },
      create: {
        id: "test-payment-invoice",
        userId: "e2e-patient",
        paymentDue: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000),
        total: rate.price,
        totalDue: rate.price,
      },
      update: {
        id: "test-payment-invoice",
        userId: "e2e-patient",
        paymentDue: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000),
        total: rate.price,
        totalDue: rate.price,
      },
    });

    await prisma.lineItem.upsert({
      where: {
        id: "test-payment-lineitem",
      },
      create: {
        id: "test-payment-lineitem",
        quantity: 1,
        invoiceId: testInvoice.id,
        total: rate.price,
      },
      update: {
        id: "test-payment-lineitem",
        quantity: 1,
        invoiceId: testInvoice.id,
        total: rate.price,
      },
    });
  });

  patientTest("make payment on invoice", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("link", { name: "Pay Bills" }).click();
    await page.locator("#upcoming-bills div a:first-of-type").click();

    await page
      .getByRole("combobox", { name: "Payment Source" })
      .selectOption({ label: "Bank Account" });

    // Get total due from page to pay it.
    const amountText = await page.locator("#amount-due").innerText();

    await page.getByLabel("Amount").fill(amountText.replace("$", ""));

    await page.getByRole("button", { name: "Pay" }).click();
    await page.getByText("Payment Success!").waitFor();

    expect(page.url()).toContain("success");

    await expect(
      page.getByRole("heading", { name: "Payment Success!" })
    ).toBeVisible();
  });

  patientTest("make $0 payment", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("link", { name: "Pay Bills" }).click();
    await page.locator("#upcoming-bills div a:first-of-type").first().click();

    await page
      .getByRole("combobox", { name: "Payment Source" })
      .selectOption({ label: "Bank Account" });

    await page.getByLabel("Amount").fill("0");

    await page.getByRole("button", { name: "Pay" }).click();
    await expect(
      page.getByRole("heading", { name: "Payment Success!" })
    ).not.toBeVisible();
  });

  patientTest("make payment greater than amount due", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("link", { name: "Pay Bills" }).click();
    await page.locator("#upcoming-bills div a:first-of-type").first().click();

    await page
      .getByRole("combobox", { name: "Payment Source" })
      .selectOption({ label: "Bank Account" });

    // Get total due from page to pay it.
    const amountText = await page.locator("#amount-due").innerText();
    const amountToPay = (parseFloat(amountText.replace("$", "")) + 10).toFixed(
      2
    );

    await page.getByLabel("Amount").fill(amountToPay);
    await page.getByRole("button", { name: "Pay" }).click();

    await expect(
      page.getByText("Payment amount exceeds amount due")
    ).toBeVisible();
  });
});
