// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from "../../server/db";

/**
 * add times to db
 */
export default async function storeAppoints(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  interface infoFromAvailability {
    times:[string,number,string,number,string][],
  }
  const times:[string,number,string,number,string][] = Array.from((req.body as infoFromAvailability).times);
  const startEndDayInfo:[string,string,number,string,string,number][] = [];
  times.forEach((timeIntInt) => {
    const time = timeIntInt[0];
    const day = timeIntInt[1];
    const docId = timeIntInt[2];
    const weekCount = timeIntInt[3]; 
    const userId = timeIntInt[4];
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
    startEndDayInfo.push([time,endTime,day,docId,userId,weekCount]); //push in start time
  });
  const results = [];
  const today = new Date();
  const todayDay = today.getDay();
  for await (const startEndDayArray of startEndDayInfo){
    const storeDay = startEndDayArray[2];
    const weekCount = startEndDayArray[5];
    const offset = todayDay - (storeDay + weekCount * 7);
    const newDay = new Date(today.getTime());
    newDay.setDate(newDay.getDate()-offset); // properly handles day and increments month when necessary
    let doctorId = startEndDayArray[3];
    
    let twoDigMonth = (newDay.getMonth() + 1).toString();
    if (twoDigMonth.length == 1) twoDigMonth = "0" + twoDigMonth;
    let twoDigDay = newDay.getDate().toString();
    if (twoDigDay.length == 1) twoDigDay = "0" + twoDigDay;


    const newDayString = `${newDay.getFullYear()}-${twoDigMonth}-${twoDigDay}`;
    if (doctorId === "AllDoctors"){ // find the first doctor and set this doctor id for the appointment to be made
      const tempDoctorId: {docId: string;}[] = await prisma.$queryRawUnsafe(`SELECT docId FROM Availability WHERE day=${storeDay} AND startTime="${startEndDayArray[0]}" AND date="${newDayString}" LIMIT 1`)
      if (tempDoctorId[0]) doctorId = tempDoctorId[0].docId;
    }
    const removeAvailability = await prisma.$executeRawUnsafe(`DELETE FROM Availability WHERE day=${storeDay} AND startTime="${startEndDayArray[0]}" AND docId="${doctorId}" AND date="${newDayString}"`)

    const result = await prisma.appointment.create({
      data: {
        day:storeDay,
        startTime: startEndDayArray[0],
        endTime: startEndDayArray[1],
        docId: doctorId,
        userName: startEndDayArray[4],
        date: newDay, // later get the correct date
      },
    })
    results.push(result);
    results.push(removeAvailability);
  }
  
  return res.status(201).json(results)
}