import type { Invoice, LineItem, Rate } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const invoiceRouter = createTRPCRouter({
  getName: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const result: [{ name: string }] = await ctx.prisma.$queryRawUnsafe(
        `SELECT name FROM User WHERE id="${id}"`
      );
      return result[0] as { name: string };
    }),
  getProcedures: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      // get the ids of all line items associated with this invoice id
      const invoiceIdLineItems: { A: string; B: string }[] =
        await ctx.prisma.$queryRawUnsafe(
          `SELECT * from _invoicetolineitem where A="${id}"`
        );
      // get all line items associated with this invoice id
      const lineItems: LineItem[] = [];
      for await (const thisInvoicesLineItem of invoiceIdLineItems) {
        // get this line item that was associated with this invoice id
        const aLineItem: LineItem[] = await ctx.prisma.$queryRawUnsafe(
          `SELECT * from lineitem where id="${
            (thisInvoicesLineItem as { A: string; B: string }).B
          }"`
        );
        lineItems.push(aLineItem[0] as LineItem);
      }
      const result: Rate[] = [];
      for await (const lineItem of lineItems) {
        const rate: Rate[] = await ctx.prisma.$queryRawUnsafe(
          `SELECT * FROM Rate WHERE id="${lineItem.rateId}"`
        );
        result.push(rate[0] as Rate);
      }

      return result;
    }),
  add: protectedProcedure
    .input(
      z.object({
        rateId: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { rateId, id } = input;
      // check if there already is a line item with the same rateId for this invoice id

      // get the ids of all line items associated with this invoice id
      const invoiceIdLineItems: { A: string; B: string }[] =
        await ctx.prisma.$queryRawUnsafe(
          `SELECT * from _invoicetolineitem where A="${id}"`
        );

      // get the price of the rate via rateId
      const ratePrice: { price: number }[] = await ctx.prisma.$queryRawUnsafe(
        `SELECT price FROM Rate WHERE id="${rateId}"`
      );
      const price = (ratePrice[0] as { price: number }).price;

      // add price from rate to invoice total and balance
      await ctx.prisma.$queryRawUnsafe(
        `UPDATE invoice SET total = total + ${price}, totalDue = totalDue + ${price} WHERE id="${id}"`
      );

      // go through all line items associated with this invoice id
      let lineItem: LineItem | undefined;
      if (invoiceIdLineItems.length > 0) {
        for await (const thisInvoicesLineItem of invoiceIdLineItems) {
          // get this line item that was associated with this invoice id
          const potentialLineItem: LineItem[] =
            await ctx.prisma.$queryRawUnsafe(
              `SELECT * from lineitem where id="${
                (thisInvoicesLineItem as { A: string; B: string }).B
              }"`
            );
          if (potentialLineItem[0]) {
            if (potentialLineItem[0].rateId === rateId) {
              lineItem = potentialLineItem[0];
            }
          }
        }
      }

      if (lineItem) {
        // if there already is a lineItem make quantity go up 1
        const quantityUpdate: LineItem[] = await ctx.prisma.$queryRawUnsafe(
          `UPDATE lineitem SET quantity = quantity + 1 WHERE id="${lineItem.id}"`
        );
        return quantityUpdate;
      } else {
        // if not add a line item with this rate id and with this invoice id

        /**
         * https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
         * @returns
         */
        function generateUUID() {
          // Public Domain/MIT
          let d = new Date().getTime(); //Timestamp
          let d2 =
            (typeof performance !== "undefined" &&
              performance.now &&
              performance.now() * 1000) ||
            0; //Time in microseconds since page-load or 0 if unsupported
          return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
              let r = Math.random() * 16; //random number between 0 and 16
              if (d > 0) {
                //Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
              } else {
                //Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
              }
              return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
            }
          );
        }

        const newId = generateUUID();
        await ctx.prisma.$queryRawUnsafe(
          `INSERT INTO lineitem (id, quantity, rateId) VALUES ("${newId}", 1, "${rateId}")`
        );
        const result = await ctx.prisma.$executeRawUnsafe(
          `INSERT INTO _invoicetolineitem (A, B) VALUES ("${id}", "${newId}")`
        );
        return result;
      }
    }),
  remove: protectedProcedure
    .input(
      z.object({
        rateId: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { rateId, id } = input;
      // get the ids of all line items associated with this invoice id
      const invoiceIdLineItems: { A: string; B: string }[] =
        await ctx.prisma.$queryRawUnsafe(
          `SELECT * from _invoicetolineitem where A="${id}"`
        );

      // get the price of the rate via rateId
      const ratePrice: { price: number }[] = await ctx.prisma.$queryRawUnsafe(
        `SELECT price FROM Rate WHERE id="${rateId}"`
      );
      const price = (ratePrice[0] as { price: number }).price;

      // subtract price from rate to invoice total and balance
      await ctx.prisma.$queryRawUnsafe(
        `UPDATE invoice SET total = total - ${price}, totalDue = totalDue - ${price} WHERE id="${id}"`
      );

      // go through all line items associated with this invoice id
      let lineItem: LineItem | undefined;
      if (invoiceIdLineItems.length > 0) {
        for await (const thisInvoicesLineItem of invoiceIdLineItems) {
          // get this line item that was associated with this invoice id
          const potentialLineItem: LineItem[] =
            await ctx.prisma.$queryRawUnsafe(
              `SELECT * from lineitem where id="${
                (thisInvoicesLineItem as { A: string; B: string }).B
              }"`
            );
          if (potentialLineItem[0]) {
            if (potentialLineItem[0].rateId === rateId) {
              lineItem = potentialLineItem[0];
            }
          }
        }
      }

      // make lineItem make quantity go down 1
      const quantityUpdate: LineItem[] = await ctx.prisma.$queryRawUnsafe(
        `UPDATE lineitem SET quantity = quantity - 1 WHERE id="${
          (lineItem as LineItem).id
        }"`
      );

      // check for quantities of 0 and delete line item and delete from _invoicetolineitem
      if ((lineItem as LineItem).quantity === 1) {
        await ctx.prisma.$executeRawUnsafe(
          `DELETE FROM lineitem WHERE id="${(lineItem as LineItem).id}"`
        );
        await ctx.prisma.$executeRawUnsafe(
          `DELETE FROM _invoicetolineitem WHERE B="${
            (lineItem as LineItem).id
          }"`
        );
      }

      return quantityUpdate;
    }),
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const [count, items] = await ctx.prisma.$transaction([
        ctx.prisma.invoice.count(),
        ctx.prisma.invoice.findMany({
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
        }),
      ]);

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }

      return {
        count,
        items,
        nextCursor,
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        paymentDue: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, paymentDue } = input;

      const todaysDate = new Date();
      const paymentDueDate = new Date(paymentDue);

      if (paymentDueDate < todaysDate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invoice date must be in the future.`,
        });
      }

      const newInvoice = await ctx.prisma.invoice.create({
        data: {
          userId,
          paymentDue: paymentDueDate,
        },
      });

      return newInvoice;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
        paymentDue: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, userId, paymentDue } = input;

      const todaysDate = new Date();
      const paymentDueDate = new Date(paymentDue);

      if (paymentDueDate < todaysDate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invoice date must be in the future.`,
        });
      }

      const updatedInvoice = await ctx.prisma.$executeRawUnsafe(
        `UPDATE Invoice SET userId="${userId}", paymentDue="${paymentDue}" WHERE id="${id}"`
      );

      return updatedInvoice;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const deletedInvoice = await ctx.prisma.$executeRawUnsafe(
        `DELETE FROM Invoice WHERE id="${id}"`
      );

      return deletedInvoice;
    }),
  send: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      //get all invoices with this id
      const invoices: Invoice[] = await ctx.prisma.$queryRawUnsafe(
        `SELECT * FROM Invoice WHERE id="${id}"`
      );
      return invoices;
    }),
});
