import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const bedRouter = createTRPCRouter({
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
