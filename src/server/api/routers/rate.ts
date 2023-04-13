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
        rate: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, description, rate } = input;

      const newRate = await ctx.prisma.rate.create({
        data: {
          name,
          description,
          rate: parseFloat(rate),
        },
      });

      return newRate;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        rate: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, description, rate } = input;

      const updatedRate = await ctx.prisma.$executeRawUnsafe(
        `UPDATE Rate SET name="${name}", description="${description}", rate=${parseFloat(
          rate
        )} WHERE id="${id}"`
      );

      return updatedRate;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const deletedRate = await ctx.prisma.$executeRawUnsafe(
        `DELETE FROM Rate WHERE id="${id}"`
      );

      return deletedRate;
    }),
});