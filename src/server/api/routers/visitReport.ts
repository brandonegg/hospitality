import type { VisitReport } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
export interface VisitReportSummary extends VisitReport {
  patient_name: string | null;
  author_name: string | null;
}

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
          temperature: z.number().min(0),
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

      const patientIdMatches: Record<string, string>[] = await ctx.prisma
        .$queryRaw`SELECT COUNT(*) as count FROM User WHERE id = ${patientId}`;
      const doctorIdMatches: Record<string, string>[] = await ctx.prisma
        .$queryRaw`SELECT COUNT(*) as count FROM User WHERE id = ${doctorId}`;

      console.log(patientIdMatches);

      if (
        (patientIdMatches[0] &&
          parseInt(patientIdMatches[0]["count"] ?? "0") === 0) ||
        !patientIdMatches[0]?.count
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No patient found with the provided patientId",
        });
      }

      if (
        (doctorIdMatches[0] &&
          parseInt(doctorIdMatches[0]["count"] ?? "0") === 0) ||
        !doctorIdMatches[0]?.count
      ) {
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
              temperature: vitals.temperature,
              weight: vitals.weight,
              respiration: vitals.respiration,
              oxygenSaturation: vitals.oxygenSaturation,
              patientId,
            },
          },
        },
      });
    }),
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const postVisit = await ctx.prisma.visitReport.findUnique({
        where: {
          id: input.id,
        },
        include: {
          patient: true,
          author: true,
          vitals: true,
          soapNotes: true,
        },
      });

      if (!postVisit) {
        new TRPCError({
          code: "BAD_REQUEST",
          message: "No visit request found with this ID",
        });
      }

      if (
        postVisit?.patientId === ctx.session.user.id ||
        postVisit?.doctorId === ctx.session.user.id
      ) {
        return postVisit;
      }

      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You do not have access to this page",
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.visitReport.deleteMany({
        where: {
          AND: {
            id: input.id,
            doctorId: ctx.session.user.id,
          },
        },
      });
    }),
  getAll: protectedProcedure
    .input(
      z.object({
        doctorId: z.string().optional(),
        patientId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { doctorId, patientId } = input;

      if (!doctorId && !patientId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "A doctor ID or patient ID is required.",
        });
      }

      if (doctorId && patientId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Supply either a doctor ID or patient ID, not both",
        });
      }

      if (patientId) {
        const visitReports: VisitReportSummary[] = await ctx.prisma.$queryRaw`
          SELECT vr.*, a.name as author_name, p.name as patient_name 
          FROM 
            VisitReport vr 
            JOIN User a ON vr.doctorId = a.id 
            JOIN User p ON vr.patientId = p.id 
          WHERE vr.patientId = ${patientId};`;

        return visitReports;
      }

      const visitReports: VisitReportSummary[] = await ctx.prisma.$queryRaw`
        SELECT vr.*, a.name as author_name, p.name as patient_name 
        FROM 
          VisitReport vr 
          JOIN User a ON vr.doctorId = a.id 
          JOIN User p ON vr.patientId = p.id 
        WHERE vr.doctorId = ${doctorId};`;

      return visitReports;
    }),
});
