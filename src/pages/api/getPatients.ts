// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../server/db";

/**
 * get all patients who don't have an invoice
 */
export default async function getPatients(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result: User[] = await prisma.$queryRawUnsafe(
    `SELECT * FROM User WHERE role="PATIENT"`
  );
  const invoices: { userId: string }[] = await prisma.$queryRawUnsafe(
    `SELECT userId FROM Invoice`
  );
  const invoiceUserIds = invoices.map((invoice) => invoice.userId);

  const filterFun = function (user: User) {
    return !invoiceUserIds.includes(user.id); //use the argument here.
  };
  const fin = result.filter(filterFun);
  return res.status(201).json(fin);
}
