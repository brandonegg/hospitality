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
    const doctorId = (req.body as {docId: number});
    const result = await prisma.availability.findMany({
        where: doctorId,
    })
    return res.status(201).json(result)
}