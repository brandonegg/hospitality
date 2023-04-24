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

  const paymentTotal: { "SUM(amount)": number }[] =
    await prisma.$queryRawUnsafe(
      `SELECT SUM(amount) FROM payment WHERE invoiceId = '${id}'`
    );

  await prisma.invoice.update({
    where: {
      id,
    },
    data: {
      total: billTotal.toFixed(2),
      totalDue: (billTotal - (paymentTotal[0]?.["SUM(amount)"] ?? 0)).toFixed(
        2
      ),
    },
  });
};

export { updateInvoiceTotal };
