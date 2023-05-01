import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

import { defaultUserSelect } from "./user";

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
          include: {
            building: true,
            occupant: {
              select: defaultUserSelect,
            },
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
        room: z.string(),
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string().max(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { room, street, city, state, zipCode } = input;

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
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        room: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, room } = input;

      // Update the user
      return await ctx.prisma.bed.update({
        where: { id },
        data: { room },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const bed = await ctx.prisma.bed.findUnique({
        where: { id },
      });

      if (!bed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No bed found with provided ID",
        });
      }

      if (bed.userId !== null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bed is currently occupied. Please remove occupant first.",
        });
      }

      // Delete the bed
      return await ctx.prisma.bed.delete({
        where: { id },
      });
    }),
  assign: protectedProcedure
    .input(z.object({ bedId: z.string(), patientId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const userMatches: Record<string, string>[] | null = await ctx.prisma
        .$queryRaw`SELECT COUNT(*) as count FROM Bed WHERE userId = ${input.patientId}`;

      if (userMatches && userMatches[0] && userMatches[0]["count"]) {
        const matchCount = parseInt(userMatches[0]["count"]);

        if (matchCount > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "User is already assigned to a bed and cannot be reassigned!",
          });
        }
      }

      return await ctx.prisma.bed.update({
        where: { id: input.bedId },
        data: { userId: input.patientId ? input.patientId : null },
      });
    }),
});
