import type { Invoice, Payment, PaymentSource } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { updateInvoiceTotal } from "../../../lib/invoice/update";
import { parsePriceString } from "../../../lib/text";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const paymentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        amount: z.string(),
        invoiceId: z.string(),
        sourceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, amount, invoiceId, sourceId } = input;

      const parsedAmount = parsePriceString(amount);

      if (!parsedAmount) {
        throw new TRPCError({
          message: "Invalid price string format.",
          code: "BAD_REQUEST",
        });
      }

      const userIdMatches: number = await ctx.prisma
        .$queryRaw`SELECT COUNT(*) FROM User WHERE id = ${userId};`;

      if (userIdMatches == 0) {
        throw new TRPCError({
          message: "No user found with provided ID",
          code: "BAD_REQUEST",
        });
      }

      const sourceIdMatches: number = await ctx.prisma
        .$queryRaw`SELECT COUNT(*) FROM PaymentSource WHERE id = ${sourceId};`;

      if (sourceIdMatches == 0) {
        throw new TRPCError({
          message: "No source found with provided ID",
          code: "BAD_REQUEST",
        });
      }

      const invoiceMatch: Invoice[] | undefined = await ctx.prisma
        .$queryRaw`SELECT * FROM Invoice WHERE id = ${invoiceId};`;

      const invoice = invoiceMatch ? invoiceMatch[0] : undefined;

      if (!invoice) {
        throw new TRPCError({
          message: "No invoice found with provided ID",
          code: "BAD_REQUEST",
        });
      }

      if (parseFloat(parsedAmount) == 0) {
        throw new TRPCError({
          message: "Payment amount can't be 0",
          code: "BAD_REQUEST",
        });
      }

      if (parseFloat(invoice.totalDue) < parseFloat(parsedAmount)) {
        throw new TRPCError({
          message: "Payment amount exceeds amount due",
          code: "BAD_REQUEST",
        });
      }

      const payment = await ctx.prisma.payment.create({
        data: {
          invoiceId,
          sourceId,
          userId,
          amount: parsedAmount,
          date: new Date(),
        },
      });

      await updateInvoiceTotal(invoice.id);

      return payment;
    }),
  getSources: protectedProcedure.query(async ({ ctx }) => {
    const sources: PaymentSource[] | undefined = await ctx.prisma
      .$queryRaw`SELECT * FROM PaymentSource`;
    return sources;
  }),
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const payments: Payment[] | undefined = await ctx.prisma
        .$queryRaw`SELECT * FROM Payment WHERE id = ${input.id};`;

      const uniquePayment = payments ? payments[0] : undefined;

      return uniquePayment;
    }),
});
