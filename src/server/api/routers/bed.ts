import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const bedRouter = createTRPCRouter({
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
        ctx.prisma.bed.count(),
        ctx.prisma.bed.findMany({
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
        room: z.string(),
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string().max(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        room,
        street,
        city,
        state,
        zipCode,
      } = input;

      // format and create the address data
      const newAddress = {
        street,
        city,
        state,
        zipCode: parseInt(zipCode, 10),
      };

      const address = await ctx.prisma.address.create({
        data: newAddress,
      });

      const newBed = {
        room,
        addressId: address.id,
      };

      // Create the bed
      const bed = await ctx.prisma.bed.create({
        data: newBed,
      });

      return bed;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      // Delete the bed
      return await ctx.prisma.bed.delete({
        where: { id },
      });
    }),
});
