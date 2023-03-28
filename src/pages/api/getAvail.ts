// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from "../../server/db";

/**
 * get a given doctors availability for appointments
 */
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const weekCount = (req.body as {docId: string, weekCount:number}).weekCount;
    const today = new Date();
    const todayDay = today.getDate();
    const offset = todayDay + weekCount * 7;
    const weekScaledDay = new Date(today.getTime());
    weekScaledDay.setDate(weekScaledDay.getDate()+offset); // properly handles day and increments month when necessary
    const sunday = weekScaledDay.setDate(weekScaledDay.getDate()-today.getDay());
    const saturday =  weekScaledDay.setDate(weekScaledDay.getDate()+6);
    const doctorId = (req.body as {docId: string, weekCount:number}).docId;
    if (doctorId === "AllDoctors"){
        const result = await prisma.$queryRawUnsafe(`SELECT * FROM Availability WHERE date BETWEEN ${sunday} AND ${saturday}`)
        return res.status(201).json(result)
    }
    const result = await prisma.$queryRawUnsafe(`SELECT * FROM Availability WHERE docId="${doctorId}" AND date BETWEEN ${sunday} AND ${saturday}` )

    return res.status(201).json(result)
}