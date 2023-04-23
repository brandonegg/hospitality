import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { updateInvoiceTotal } from "../../../utils/invoice/update";
import { parsePriceString } from "../../../utils/text";
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
      console.log(parsedAmount);

      if (!parsedAmount) {
        throw new TRPCError({
          message: "Invalid price string format.",
          code: "BAD_REQUEST",
        });
      }

      const userIdMatches = await ctx.prisma.user.count({
        where: {
          id: userId,
        },
      });

      if (userIdMatches == 0) {
        throw new TRPCError({
          message: "No user found with provided ID",
          code: "BAD_REQUEST",
        });
      }

      const sourceIdMatches = await ctx.prisma.paymentSource.count({
        where: {
          id: sourceId,
        },
      });

      if (sourceIdMatches == 0) {
        throw new TRPCError({
          message: "No source found with provided ID",
          code: "BAD_REQUEST",
        });
      }

      const invoice = await ctx.prisma.invoice.findUnique({
        where: {
          id: invoiceId,
        },
      });

      if (!invoice) {
        throw new TRPCError({
          message: "No invoice found with provided ID",
          code: "BAD_REQUEST",
        });
      }

      if (parseFloat(invoice.totalDue) < parseFloat(parsedAmount)) {
        throw new TRPCError({
          message: "Payment amount exceeds amount due",
          code: "BAD_REQUEST",
        });
      }

      const payment = ctx.prisma.payment.create({
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
    return await ctx.prisma.paymentSource.findMany();
  }),
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.payment.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
});
