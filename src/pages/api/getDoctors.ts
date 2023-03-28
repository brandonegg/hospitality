// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { Role } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from "../../server/db";

/**
 * get a given doctors availability for appointments
 */
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const doctor = {role: ("DOCTOR" as Role)};
    const result = await prisma.user.findMany({
        where: doctor,
    })
    return res.status(201).json(result)
}