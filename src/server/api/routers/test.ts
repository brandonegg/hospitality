import type { Test } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const testRouter = createTRPCRouter({
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
        ctx.prisma.test.count(),
        ctx.prisma.test.findMany({
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
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, description } = input;

      const newTest = await ctx.prisma.test.create({
        data: {
          name,
          description,
        },
      });

      return newTest;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, description } = input;

      const updatedTest = await ctx.prisma.$executeRawUnsafe(
        `UPDATE Rate Test name="${name}", description="${description}" WHERE id="${id}"`
      );

      return updatedTest;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const deletedTest = await ctx.prisma.$executeRawUnsafe(
        `DELETE FROM Test WHERE id="${id}"`
      );

      return deletedTest;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.$queryRawUnsafe(`SELECT * FROM Test`);

    return data as Test[];
  }),
});
