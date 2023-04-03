// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from "../../server/db";

/**
 * add times to db
 */
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  interface infoFromAvailability {
    times: [string,number][],
  }
  const times:[string,number][] = Array.from((req.body as infoFromAvailability).times);
  const startEndDayInfo:[string,string,number][] = [];
  times.forEach((timeInt) => {
    const time = timeInt[0];
    const day = timeInt[1];
    const timeAndAmPM = time.split(" ");
    const actualTime = timeAndAmPM[0] as string;
    const hourColonMin = actualTime.split(":");
    const startHour = hourColonMin[0];
    const startMin = hourColonMin[1];
    let endHour = startHour;
    let endMin = "30";
    if (startMin === "30"){ // hour has to increase
        if (parseInt(startHour as string) !== 12) {
            endHour = String(parseInt(startHour as string) + 1);
            timeAndAmPM[1] = "pm";
        }
        else {endHour = "1";}
        endMin = "00";
    }
    const endTime = `${endHour as string}:${endMin} ${timeAndAmPM[1] as string}`;
    startEndDayInfo.push([time,endTime,day]); //push in start time
  });
  const results = [];
  for await (const startEndDayArray of startEndDayInfo){
    const result = await prisma.availability.create({
        data: {
          day:startEndDayArray[2],
          startTime: startEndDayArray[0],
          endTime: startEndDayArray[1],
          docId: 1
        },
      });
    results.push(result);
  }

  return res.status(201).json(results);
}
