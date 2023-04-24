import type { LineItem, Payment } from "@prisma/client";

import { prisma } from "../../server/db";

/**
 * Takes order id, and updates it total based on line items.
 * @param id Order ID
 */
const updateInvoiceTotal = async (id: string) => {
  const invoiceItems: LineItem[] =
    await prisma.$queryRaw`SELECT * FROM LineItem WHERE invoiceId = ${id};`;

  const billTotal = invoiceItems
    .map((item) => {
      return parseFloat(item.total);
    })
    .reduce((sum, current) => {
      return sum + current;
    }, 0);

  const invoicePayments: Payment[] =
    await prisma.$queryRaw`SELECT * FROM Payment WHERE invoiceId = ${id};`;

  const paymentTotal = invoicePayments
    .map((payment) => {
      return parseFloat(payment.amount);
    })
    .reduce((sum, current) => {
      return sum + current;
    }, 0);

  /* eslint-disable prettier/prettier */
  await prisma.$queryRaw`UPDATE Invoice
                         SET total = ${billTotal.toFixed(2)}, totalDue = ${(billTotal - paymentTotal).toFixed(2)}
                         WHERE id = ${id};`;
  /* eslint-enable prettier/prettier */
};

export { updateInvoiceTotal };
