import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const rateRouter = createTRPCRouter({
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
        ctx.prisma.rate.count(),
        ctx.prisma.rate.findMany({
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
        rate: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, description, rate } = input;

      const newRate = await ctx.prisma.$executeRawUnsafe(
        `INSERT INTO "Rate" ("name", "description", "rate") VALUES (${name}, ${description}, ${rate})`
      );

      return newRate;
    }),
});
