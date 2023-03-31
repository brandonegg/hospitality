import { Prisma } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

/**
 * For testing purposes, can't match a randomly generate id
 */
const defaultAvailSelector = Prisma.validator<Prisma.AvailabilitySelect>()({
    day:true,
    startTime:true,
    endTime:true,
    docId:true,
    date:true,
  });

export const storeAvailRouter = createTRPCRouter({
    storeAvails: publicProcedure
        .input(
            z.object({
                day: z.number(),
                startTime: z.string(),
                docId: z.string(),
                weekCount: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            /**
             * make end time from start time
             * @param startTime
             * @returns 
             */
            const makeEndTime = (startTime: string) => {
                const timeAndAmPM = startTime.split(" ");
                const startHour = parseInt((timeAndAmPM[0] as string).split(":")[0] as string);
                const startMin = parseInt((timeAndAmPM[0] as string).split(":")[1] as string);
                let endHour = startHour;
                let endMin = "30";
                if (startMin === 30){ // hour has to increase
                    if (startHour !== 12) {
                        endHour = startHour + 1;
                        timeAndAmPM[1] = "pm";
                    }
                    else {endHour = 1;}
                    endMin = "00";
                }
                
                return `${endHour}:${endMin}`;
            };

            /**
             * Make the correct Date to store in the database
             * @param day 
             * @param weekCount 
             */
            const makeCorrectDate = (day: number, weekCount: number) => {
                const storeDay = day;
                const offset = todayDay - (storeDay + weekCount * 7);
                const newDay = new Date(today.getTime());
                newDay.setDate(newDay.getDate()-offset); // properly handles day and increments month when necessary
                return newDay;
            }


            const today = new Date();
            const todayDay = today.getDay();

            console.log( {
                day: input.day,
                startTime: input.startTime,
                endTime: makeEndTime(input.startTime),
                docId: input.docId,
                date: makeCorrectDate(input.day, input.weekCount)
            });

            const data = {
                day: input.day,
                startTime: input.startTime,
                endTime: makeEndTime(input.startTime),
                docId: input.docId,
                date: makeCorrectDate(input.day, input.weekCount)
            }
            console.log(data)

            const avail = await ctx.prisma.availability.create({
                data,
                select: defaultAvailSelector,
            });

            await ctx.prisma.originalAvailability.create({
                data,
                select: defaultAvailSelector,
            });

            console.log(avail);
            return avail; // origAvail is same
        })
});