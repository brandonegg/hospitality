// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../server/db";

/**
 * get a given doctors availability for appointments
 */
export default async function getPatients(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await prisma.$queryRawUnsafe(
    `SELECT * FROM User WHERE role="PATIENT"`
  );
  return res.status(201).json(result);
}
