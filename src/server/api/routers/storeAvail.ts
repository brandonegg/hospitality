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

/**
 * Process the input to make the correct data to store in the database
 * @param input 
 * @returns 
 */
export const processInput = (input: {
    day: number;
    startTime: string;
    docId: string;
    weekCount: number;
}) => {
    return {
        day: input.day,
        startTime: input.startTime,
        endTime: makeEndTime(input.startTime),
        docId: input.docId,
        date: makeCorrectDate(new Date(), input.day, input.weekCount)
    }
}

/**
     * make end time from start time
     * @param startTime
     * @returns 
     */
export const makeEndTime = (startTime: string) => {
    const timeAndAmPM = startTime.split(" ");
    type amPmType = "am" | "pm";
    /**
     * handles 11:30 am to 12:00 pm and 11:30 pm to 12:00 am
     * @param amPm 
     * @returns 
     */
    function flipAmPm(amPm: amPmType): amPmType {
        if (amPm === "am") return "pm";
        else return "am";
    }
    let amPm = timeAndAmPM[1] as amPmType;
    const startHour = parseInt((timeAndAmPM[0] as string).split(":")[0] as string);
    const startMin = parseInt((timeAndAmPM[0] as string).split(":")[1] as string);
    let endHour = startHour;
    let endMin = "30";
    if (startMin === 30){ // hour has to increase
        if (startHour === 11) {
            endHour = 12;
            amPm = flipAmPm(amPm);
        }
        else if (startHour === 12){
            endHour = 1;
        }
        else {endHour += 1;}
        endMin = "00";
    }
    
    return `${endHour}:${endMin} ${amPm as string}`;
};

/**
 * Make the correct Date to store in the database
 * @param day 
 * @param weekCount 
 */
export const makeCorrectDate = (startDate:Date, day: number, weekCount: number) => {
        const todayDay = startDate.getDay();
        const offset = -(todayDay - day) + weekCount * 7;
        const newDay = new Date(startDate.getTime());
        newDay.setDate(newDay.getDate() + offset); // properly handles day and increments month when necessary
        return newDay;
    }

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
            
            const data = processInput(input);

            const avail = await ctx.prisma.availability.create({
                data,
                select: defaultAvailSelector,
            });

            await ctx.prisma.originalAvailability.create({
                data,
                select: defaultAvailSelector,
            });

            return avail; // origAvail is same
        })
});