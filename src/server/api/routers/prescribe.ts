import { createId } from "@paralleldrive/cuid2";
import type { MedItem, Meds, Prescription } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const prescribeRouter = createTRPCRouter({
  getName: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const result: [{ name: string }] = await ctx.prisma
        .$queryRaw`SELECT name FROM User WHERE id=${id}`;
      return result[0] as { name: string };
    }),
  getProcedures: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const results: MedItem[] = await ctx.prisma
        .$queryRaw`SELECT * FROM MedItem WHERE prescriptionId=${input.id}`;
      type MedItemWithMeds = MedItem & { meds: Meds };

      const clones: MedItemWithMeds[] = [];

      for (const result of results) {
        const medId = result.medsId;
        const meds: Meds[] = await ctx.prisma
          .$queryRaw`SELECT * FROM Meds WHERE id=${medId}`;
        (result as MedItemWithMeds).meds = meds[0] as Meds;
        // need a deep copy of these objects or for whatever reason react doesn't re render to show the rate,
        //even though the object itself changes because "technically" the reference is the same despite the meds updating
        const clone = JSON.parse(JSON.stringify(result)) as MedItemWithMeds;
        clones.push(clone);
      }

      return clones;
    }),
  addItem: protectedProcedure
    .input(
      z.object({
        medsId: z.string(),
        id: z.string(),
        dosage: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { medsId, id, dosage } = input;

      const meds: Meds[] = await ctx.prisma
        .$queryRaw`SELECT * FROM Meds WHERE id = ${medsId}`;
      const med = meds[0];

      if (!med) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No Medication found with provided medsId.",
        });
      }

      if (parseInt(med.dosageMin) > parseInt(dosage)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Dosage is lower than the minimum dosage set by admin: ${med.dosageMin} ${med.unit}.`,
        });
      }
      if (parseInt(med.dosageMax) < parseInt(dosage)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Dosage is higher than the maximum dosage set by admin: ${med.dosageMax} ${med.unit}.`,
        });
      }

      const newId = createId();

      const create = await ctx.prisma
        .$executeRaw`INSERT INTO MedItem (id, dosage, prescriptionId, medsId) VALUES (${newId}, ${dosage}, ${id}, ${medsId})`;
      return create;
    }),
  removeItem: protectedProcedure
    .input(
      z.object({
        medItemId: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { medItemId, id } = input;

      const result = await ctx.prisma.medItem.deleteMany({
        where: {
          id: medItemId,
          prescriptionId: id,
        },
      });

      return result;
    }),
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
        ctx.prisma.prescription.count(),
        ctx.prisma.prescription.findMany({
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;
      const newId = createId();
      const newInvoice = await ctx.prisma
        .$executeRaw`INSERT INTO Prescription (id, userId) VALUES (${newId}, ${userId})`;

      return newInvoice;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, userId } = input;

      const updatedPrescription = await ctx.prisma
        .$executeRaw`UPDATE Prescription SET userId=${userId} WHERE id=${id}`;
      return updatedPrescription;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const deletedPrescription = await ctx.prisma
        .$executeRaw`DELETE FROM Prescription WHERE id=${id}`;
      return deletedPrescription;
    }),
  send: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      //get the prescription with this id
      const prescription: Prescription[] = await ctx.prisma
        .$queryRaw`SELECT * FROM Prescription WHERE id=${id}`;
      return prescription[0] as Prescription;
    }),
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.prescription.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
});
