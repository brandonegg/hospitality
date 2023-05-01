import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const visitReportRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        soapNotes: z.object({
          subjective: z.string(),
          objective: z.string(),
          assessment: z.string(),
          plan: z.string(),
        }),
        vitals: z.object({
          pulse: z.number().min(0),
          temeprature: z.number().min(0),
          weight: z.number().min(0),
          oxygenSaturation: z.number().max(100).min(0),
          respiration: z.number().min(0),
        }),
        patientId: z.string(),
        doctorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { soapNotes, vitals, patientId, doctorId } = input;

      const patientIdMatches = await ctx.prisma
        .$executeRaw`SELECT id FROM User WHERE id = ${patientId}`;
      const doctorIdMatches = await ctx.prisma
        .$executeRaw`SELECT id FROM User WHERE id = ${doctorId}`;

      if (patientIdMatches < 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No patient found with the provided patientId",
        });
      }

      if (doctorIdMatches < 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No doctor found with the provided doctorId",
        });
      }

      const creationDate = new Date();

      return ctx.prisma.visitReport.create({
        data: {
          date: creationDate,
          doctorId,
          patientId,
          soapNotes: {
            create: {
              subjective: soapNotes.subjective,
              objective: soapNotes.objective,
              assessment: soapNotes.assessment,
              plan: soapNotes.plan,
              doctorId,
            },
          },
          vitals: {
            create: {
              date: creationDate,
              pulse: vitals.pulse,
              temperature: vitals.temeprature,
              weight: vitals.weight,
              respiration: vitals.respiration,
              oxygenSaturation: vitals.oxygenSaturation,
              patientId,
            },
          },
        },
      });
    }),
});
