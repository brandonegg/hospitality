import type { Appointment } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const removeAppointRouter = createTRPCRouter({
    removeAppoint: publicProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {

            const id = input.id;
            const today = new Date();
            const nextWeek =  new Date(today.getTime());
            nextWeek.setDate(today.getDate()+7); // find the Date for the last day of the week

            // grab info on the appointment to re add it to availability
            const result:Appointment[] = await ctx.prisma.$queryRawUnsafe(`SELECT * FROM Appointment WHERE id="${id}"`);
            const realResult = result[0] as Appointment;
            const doctorId = realResult.docId;

            // remove from appointment table
            await ctx.prisma.$executeRawUnsafe(`DELETE FROM Appointment WHERE id="${id}"`);

            // re add to availability table
            await ctx.prisma.$executeRawUnsafe(`INSERT INTO Availability (id, day, startTime, endTime, docId, date) VALUES ("${realResult.id}", ${realResult.day}, "${realResult.startTime}", "${realResult.endTime}", "${doctorId}", "${new Date(realResult.date.getTime() - realResult.date.getTimezoneOffset() * -60000).toISOString().slice(0, 10)}")`);
            return result;
        }),
});
