// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../server/db";

/**
 * get all the rates to add to an invoice
 */
export default async function getBillrates(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await prisma.$queryRawUnsafe(`SELECT * FROM Rate;`);
  return res.status(201).json(result);
}
