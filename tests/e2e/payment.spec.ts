import { test } from "@playwright/test";

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

    const testLineItem = await prisma.lineItem.upsert({
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

  patientTest("make payment on invoice", (page) => {
    return;
  });
});
