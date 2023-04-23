import { prisma } from "../../server/db";

/**
 * Takes order id, and updates it total based on line items.
 * @param id Order ID
 */
const updateInvoiceTotal = async (id: string) => {
  const invoice = await prisma.invoice.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      items: true,
      payments: true,
    },
  });

  const billTotal = invoice.items
    .map((item) => {
      return parseFloat(item.total);
    })
    .reduce((sum, current) => {
      return sum + current;
    }, 0);

  const paymentTotal = invoice.payments
    .map((payment) => {
      return parseFloat(payment.amount);
    })
    .reduce((sum, current) => {
      return sum + current;
    }, 0);

  await prisma.invoice.update({
    where: {
      id,
    },
    data: {
      total: billTotal.toFixed(2),
      totalDue: (billTotal - paymentTotal).toFixed(2),
    },
  });
};

export { updateInvoiceTotal };
