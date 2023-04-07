// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from "../../server/db";

/**
 * get a given doctors availability for appointments
 */
export default async function getAvails(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const weekCount = (req.body as {docId: string, weekCount:number}).weekCount;
    const today = new Date();
    const offset = weekCount * 7;
    const weekScaledDay = new Date(today.getTime());
    weekScaledDay.setDate(weekScaledDay.getDate()+offset); // properly handles day and increments month when necessary
    const sunday = new Date(weekScaledDay.getTime());
    sunday.setDate(weekScaledDay.getDate()-today.getDay()); // find the Date for the first day of the week
    const saturday =  new Date(sunday.getTime());
    saturday.setDate(sunday.getDate()+6); // find the Date for the last day of the week (6 more than sunday)
    const doctorId = (req.body as {docId: string, weekCount:number}).docId;

    /**
     * convert Date to the String stored in db
     * @param newDay
     */
    function dateToString(newDay:Date){
        let twoDigMonth = (newDay.getMonth() + 1).toString();
        if (twoDigMonth.length == 1) twoDigMonth = "0" + twoDigMonth;
        let twoDigDay = newDay.getDate().toString();
        if (twoDigDay.length == 1) twoDigDay = "0" + twoDigDay;
        return `${newDay.getFullYear()}-${twoDigMonth}-${twoDigDay}`;
    }

    if (doctorId === "AllDoctors"){
        const result = await prisma.$queryRawUnsafe(`SELECT * FROM Availability WHERE date BETWEEN "${dateToString(sunday)}" AND "${dateToString(saturday)}"`);
        return res.status(201).json(result);
    }
    const result = await prisma.$queryRawUnsafe(`SELECT * FROM Availability WHERE docId="${doctorId}" AND date BETWEEN "${dateToString(sunday)}" AND "${dateToString(saturday)}"` );

    return res.status(201).json(result);
}
