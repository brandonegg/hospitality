import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

/**
 * convert Date to the String stored in db
 * @param newDay
 */
function dateToString(newDay: Date) {
  let twoDigMonth = (newDay.getMonth() + 1).toString();
  if (twoDigMonth.length == 1) twoDigMonth = "0" + twoDigMonth;
  let twoDigDay = newDay.getDate().toString();
  if (twoDigDay.length == 1) twoDigDay = "0" + twoDigDay;
  return `${newDay.getFullYear()}-${twoDigMonth}-${twoDigDay}`;
}

export const getAppointRouter = createTRPCRouter({
  getDocAppoint: publicProcedure
    .input(
      z.object({
        docId: z.string(),
        weekCount: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const doctorId = input.docId;
      const today = new Date();
      today.setDate(today.getDate() + input.weekCount * 7);
      const nextWeek = new Date(today.getTime());
      nextWeek.setDate(today.getDate() + 6); // find the Date for the last day of the week

      // get this weeks appointments for a doctor, past todays date for upcoming date
      const result = await ctx.prisma.$queryRawUnsafe(
        `SELECT * FROM Appointment WHERE docId="${doctorId}" AND date BETWEEN "${dateToString(
          today
        )}" AND "${dateToString(nextWeek)}"`
      );
      return result;
    }),
  getDocAvail: publicProcedure
    .input(
      z.object({
        docId: z.string(),
        weekCount: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const doctorId = input.docId;
      const today = new Date();
      today.setDate(today.getDate() + input.weekCount * 7);
      const nextWeek = new Date(today.getTime());
      nextWeek.setDate(today.getDate() + 6); // find the Date for the last day of the week

      // get this weeks availability for a doctor, past todays date for upcoming date
      const result = await ctx.prisma.$queryRawUnsafe(
        `SELECT * FROM OriginalAvailability WHERE docId="${doctorId}" AND date BETWEEN "${dateToString(
          today
        )}" AND "${dateToString(nextWeek)}"`
      );
      return result;
    }),
  getPatientAppoint: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        weekCount: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = input.userId;
      const today = new Date();
      today.setDate(today.getDate() + input.weekCount * 7);
      const nextWeek = new Date(today.getTime());
      nextWeek.setDate(today.getDate() + 6); // find the Date for the last day of the week

      // get this weeks appointments for a doctor, past todays date for upcoming date
      const result = await ctx.prisma.$queryRawUnsafe(
        `SELECT * FROM Appointment WHERE userId="${userId}" AND date BETWEEN "${dateToString(
          today
        )}" AND "${dateToString(nextWeek)}"`
      );
      return result; // origAvail is same
    }),
});
