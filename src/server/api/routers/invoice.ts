import { createId } from "@paralleldrive/cuid2";
import type { Invoice, LineItem, Rate } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { updateInvoiceTotal } from "../../../lib/invoice/update";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const invoiceRouter = createTRPCRouter({
  getName: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const result: [{ name: string }] = await ctx.prisma
        .$queryRaw`SELECT name FROM User WHERE id=${id}`;
      return result[0] as { name: string };
    }),
  getProcedures: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const results: LineItem[] = await ctx.prisma
        .$queryRaw`SELECT * FROM LineItem WHERE invoiceId=${id}`;
      type LineItemWithRate = LineItem & { rate: Rate };

      const clones: LineItemWithRate[] = [];

      for (const result of results) {
        const rateId = result.rateId as string;
        const rate: Rate[] = await ctx.prisma
          .$queryRaw`SELECT * FROM Rate WHERE id=${rateId}`; // this is the line that needs to be fixed
        (result as LineItemWithRate).rate = rate[0] as Rate;
        // need a deep copy of these objects or for whatever reason react doesn't re render to show the rate,
        //even though the object itself changes because "technically" the reference is the same despite the rate updating
        const clone = JSON.parse(JSON.stringify(result)) as LineItemWithRate;
        clones.push(clone);
      }

      return clones;
    }),
  addItem: protectedProcedure
    .input(
      z.object({
        rateId: z.string(),
        invoiceId: z.string(),
        quantity: z.number().optional().default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { rateId, invoiceId, quantity } = input;

      if (quantity <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Quantity must be greater than 0.",
        });
      }

      const rates: Rate[] = await ctx.prisma
        .$queryRaw`SELECT * FROM Rate WHERE id = ${rateId}`;
      const rate = rates[0];

      if (!rate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No rate found with provided rateId.",
        });
      }

      const totalPrice = (parseFloat(rate.price) * quantity).toFixed(2);
      const createsId = createId();
      const create = await ctx.prisma
        .$queryRaw`INSERT INTO LineItem (id, quantity, rateId, invoiceId, total) VALUES (${createsId}, ${quantity}, ${rateId}, ${invoiceId}, ${totalPrice})`;

      await updateInvoiceTotal(invoiceId);

      return create;
    }),
  removeItem: protectedProcedure
    .input(
      z.object({
        lineItemId: z.string(),
        invoiceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { lineItemId, invoiceId } = input;

      const result = await ctx.prisma
        .$executeRaw`DELETE FROM LineItem WHERE id=${lineItemId} AND invoiceId=${invoiceId}`;

      await updateInvoiceTotal(invoiceId);

      return result;
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
        ctx.prisma.$executeRaw`SELECT COUNT(*) FROM Invoice`,
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

      const dueDate = new Date(
        paymentDueDate.getTime() - paymentDueDate.getTimezoneOffset() * -60000
      )
        .toISOString()
        .slice(0, 10);
      const newId = createId();
      const newInvoice = await ctx.prisma
        .$executeRaw`INSERT INTO Invoice (id, userId, paymentDue) VALUES (${newId}, ${userId}, ${dueDate})`;
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

      const updatedInvoice = await ctx.prisma
        .$executeRaw`UPDATE Invoice SET userId=${userId}, paymentDue=${paymentDue} WHERE id=${id}`;
      return updatedInvoice;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const deletedInvoice = await ctx.prisma
        .$executeRaw`DELETE FROM Invoice WHERE id=${id}`;
      return deletedInvoice;
    }),
  send: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      //get all invoices with this id
      const invoices: Invoice[] = await ctx.prisma
        .$queryRaw`SELECT * FROM Invoice WHERE id=${id}`;
      return invoices;
    }),
  getAllUserInvoices: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.invoice.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          items: {
            include: {
              rate: true,
            },
          },
          payments: {
            include: {
              source: true,
            },
          },
        },
      });
    }),
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.invoice.findUnique({
        where: {
          id: input.id,
        },
        include: {
          items: {
            include: {
              rate: true,
            },
          },
          payments: {
            include: {
              source: true,
            },
          },
        },
      });
    }),
});
