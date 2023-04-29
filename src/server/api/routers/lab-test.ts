import type { LabTest } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

import { defaultUserSelect } from "./user";

export const labTestRouter = createTRPCRouter({
  getAllPaged: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const [count, items] = await ctx.prisma.$transaction([
        ctx.prisma.labTest.count(),
        ctx.prisma.labTest.findMany({
          include: {
            user: {
              select: defaultUserSelect,
            },
            test: true,
          },
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
        testId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, testId } = input;

      const newTest = await ctx.prisma.labTest.create({
        data: {
          userId,
          testId,
        },
      });

      return newTest;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
        testId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, userId, testId } = input;

      const updatedTest = await ctx.prisma.$executeRawUnsafe(
        `UPDATE LabTest SET userId="${userId}", testId="${testId}" WHERE id="${id}"`
      );

      return updatedTest;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const deletedTest = await ctx.prisma.$executeRawUnsafe(
        `DELETE FROM LabTest WHERE id="${id}"`
      );

      return deletedTest;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.$queryRawUnsafe(`SELECT * FROM LabTest`);

    return data as LabTest[];
  }),
});
