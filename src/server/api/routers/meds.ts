import { createId } from "@paralleldrive/cuid2";
import type { Meds } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const medsRouter = createTRPCRouter({
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
        dosageMin: z.number(),
        dosageMax: z.number(),
        unit: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, dosageMin, dosageMax, unit } = input;

      const newMed = await ctx.prisma.$executeRawUnsafe(
        `INSERT INTO Meds (id, name, dosageMin, dosageMax, unit) VALUES ("${createId()}", "${name}", ${dosageMin}, ${dosageMax}, "${unit}");`
      );

      return newMed;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        dosageMin: z.number(),
        dosageMax: z.number(),
        unit: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, dosageMin, dosageMax, unit } = input;

      const updatedMeds = await ctx.prisma.$executeRawUnsafe(
        `UPDATE Meds SET name="${name}", dosageMin=${dosageMin}, dosageMax=${dosageMax}, unit="${unit}" WHERE id="${id}";`
      );

      return updatedMeds;
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
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.$queryRawUnsafe(`SELECT * FROM Rate;`);

    return data as Meds[];
  }),
});
