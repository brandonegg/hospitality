// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from "../../server/db";

/**
 * add times to db
 */
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  interface infoFromAvailability {
    times: [string,number, number, string][],
  }
  const times:[string,number,number,string][] = Array.from((req.body as infoFromAvailability).times);
  const startEndDayInfo:[string,string,number,string,number][] = [];
  times.forEach((timeInt) => {
    const time = timeInt[0];
    const day = timeInt[1];
    const weekCount = timeInt[2];
    const doctor = timeInt[3];
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
    const endTime = `${endHour as string}:${endMin} ${timeAndAmPM[1] as string}`
    startEndDayInfo.push([time,endTime,day,doctor,weekCount]); //push in start time
  });
  const results = [];
  const today = new Date();
  const todayDay = today.getDay();
  for await (const startEndDayArray of startEndDayInfo){
    const storeDay = startEndDayArray[2];
    const weekCount = startEndDayArray[4];
    const offset = todayDay - (storeDay + weekCount * 7);
    const newDay = new Date(today.getTime());
    newDay.setDate(newDay.getDate()-offset); // properly handles day and increments month when necessary
    const result = await prisma.availability.create({
      data: {
        day:storeDay,
        startTime: startEndDayArray[0],
        endTime: startEndDayArray[1],
        docId: startEndDayArray[3],
        date: newDay,
      },
    })
    const result2 = await prisma.originalAvailability.create({
      data: {
        day:storeDay,
        startTime: startEndDayArray[0],
        endTime: startEndDayArray[1],
        docId: startEndDayArray[3],
        date: newDay,
      },
    })
    results.push(result);
    results.push(result2);
  }
  
  return res.status(201).json(results)
}