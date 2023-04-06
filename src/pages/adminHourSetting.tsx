
import Head from "next/head";
import Router from 'next/router';
import type { GetServerSideProps, GetServerSidePropsContext } from "next/types";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import React from 'react';

import { api } from "../utils/api";

interface myAvailPageProps {
    user: Session['user'],
}

// sets the time ranges to be displayed by the ui, change i to start and stop during available to set hours in military time
// change minutes and j for different minutes. hour 7, <hour 20 means 7 to 7 can be marked as available
const times: string[] = [];
times.push("12:00 am");
times.push("12:30 am");
const minutes: string[] = ["00", "30"]
for (let hour = 1; hour < 24; hour++){
  for (let min = 0; min < 2; min++){
    if (hour > 11) { // pm
      let nonMilHour = hour;
      if (hour !== 12) {nonMilHour = hour - 12;}
      const time = `${nonMilHour}:${minutes[min] as string} pm`;
      times.push(time);
    }
    else{ // am
      const time = `${hour}:${minutes[min] as string} am`;
      times.push(time);
    }
  }
}
times.push("12:00 am");

/**
 * Doctor availabilty react component.
 * @returns JSX
 */
const AdminHourSetting = () => {
    const realButtons = {
      border: "1px solid black", /* Green border */
      borderRadius: 20,
      color: "black", /* black text */
      padding: "5px 12px", /* Some padding */
      cursor: "pointer", /* Pointer/hand icon */
      display: "block", /* Make the buttons appear below each other */
    };

    /**
     * Go to the previous page  
     */
    const goBack = async () => {
      await Router.push('/')
    };

    const { mutate } = api.hours.setHours.useMutation();

    /**
     * Send the desired hours to the database
     */
    const submitToDB = () => {
      if (startHour > endHour) {
        alert("Start Time must be before the End Time")
        return;
      }
      mutate({startHour: startHour, endHour: endHour})
    }

    const [startHour, setStartHour] = React.useState(14);

    /**
     * update state when dropdown changes
     */
    const changeStartHourDropDown = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setStartHour(parseInt(event.target.value));
    };

    const [endHour, setEndHour] = React.useState(38);

    /**
     * update state when dropdown changes
     */
    const changeEndHourDropDown = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setEndHour(parseInt(event.target.value));
    };
  

    return (
      <>
        <Head>
          <title>Set Hours</title>
          <meta name="description" content="Hospitality Doctor Appointments" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <main className="min-h-screen">
          <div className="flex flex-row items-center justify-center " >
            <span className="text-2xl "> Set Doctors Earliest and Latest Availability </span>
          </div>
          <div className="flex justify-between pl-10 pr-10">
            <button onClick={goBack} style={realButtons}> Back </button>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex flex-col justify-center">
              <span> Start Time </span>
              <select id="startDropdown" value={startHour} onChange={changeStartHourDropDown}>
                {
                  times.map((time, index) => 
                      <option key={index} value={index}>{time}</option>
                )}
              </select>
              <span> End Time </span>
              <select id="endDropdown" value={endHour} onChange={changeEndHourDropDown}>
                {
                  times.map((time, index) => 
                      <option key={index} value={index}>{time}</option>
                )}
              </select> 
            </div>
          </div>
          <div className="availabilitySetter flex flex-col items-center justify-center gap-2 pt-10 pb-10">
            <button onClick={() => { void submitToDB(); }} style={realButtons}> Submit </button>
          </div>
        </main>
      </>
    );
  };

/**
 * Server side page setup
 * @param context 
 * @returns 
 */
export const getServerSideProps: GetServerSideProps<myAvailPageProps> = async (context: GetServerSidePropsContext) => {
  // Get the user session
  const session = await getSession(context);

  if (session?.user?.role !== "ADMIN") {
      return {
          redirect: {
              destination: '/',
              permanent: false,
          },
      };
  }
  else{
    return {
      props: {
        user: session.user,
      },
    };
  }
}
  
export default AdminHourSetting;