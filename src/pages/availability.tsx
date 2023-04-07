import Head from "next/head";
import { useRouter } from "next/router";
import type { GetServerSideProps, GetServerSidePropsContext } from "next/types";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from 'react';

import { api } from "../utils/api";

interface AvailPageProps {
  user: Session['user'],
}

const today = new Date();
const todayDay = today.getDay();

// convert from number used for storage and string used for display
const dayToNum = {Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6};
type day = "Sunday"|"Monday"|"Tuesday"|"Wednesday"|"Thursday"|"Friday"|"Saturday";

/**
 * make a button for availability
 * @param props
 * @returns
 */
const AvailButton = (props:{children:string, text:string, day:string }) => {
  const text = props.text;
  const day = props.day;
  const [active, setActive] = useState(false);

 /**
 * Changes active state for button so the button changes color
 */
  const changeColor = () => {
    setActive(!active);
  };
  const buttonStyle = {
    backgroundColor: active ? "green" : "white",
    border: active ? "1px solid black": "1px solid green",
    color: "black", /* black text */
    padding: "5px 12px", /* Some padding */
    cursor: "pointer", /* Pointer/hand icon */
    width: "100%",
    display: "block", /* Make the buttons appear below each other */
  };
  return (
    <button className={text + " " + day + " " + (active ? "selected" : "boxes")} onClick={changeColor} style={buttonStyle}> {text} </button>
  );
};

/**
 * Like when2meet, a column of avaialability
 * @returns JSX
 */
const ColOfAvail= (props:{children:string, day:string, week:number}) => {
  const day = props.day;
  const weekCount = props.week;
  const offset = todayDay - (dayToNum[day as day] + weekCount * 7);
  const newDay = new Date(today.getTime());
  newDay.setDate(newDay.getDate()-offset); // properly handles day and increments month when necessary


  const [times, setTimes] = useState([] as string[]);

  const { data, status } = api.hours.getHours.useQuery();

  useEffect(()=>{
    const timeSetting: string[] = [];
    const minutes: string[] = ["00", "30"];
		if (status === "success" && data) { // ~~ for int division
      for (let hour = ~~(data.startHour / 2); hour < ~~(data.endHour / 2); hour++){
        for (let min = 0; min < 2; min++){
          if (data.startHour % 2 === 1 && hour === ~~(data.startHour / 2) && min === 0){ // if the start time is :30 then skip the :00 time
            min = 1;
          }
          if (hour > 11) { // pm
            let nonMilHour = hour;
            if (hour !== 12) nonMilHour = hour - 12;
            const time = `${nonMilHour}:${minutes[min] as string} pm`;
            timeSetting.push(time);
          }
          else{ // am
            let tempHour = hour;
            if (hour === 0){ // hour 0 is midnight which should be 12:00 am instead of 0:00 am
              tempHour = 12;
            }
            const time = `${tempHour}:${minutes[min] as string} am`;
            timeSetting.push(time);
          }
        }
      }
      if (data.endHour % 2 === 1){ // if the end time has a remainder, we need the next :00
        const hour = (~~(data.endHour / 2));
        if (hour > 11) { // pm
          let nonMilHour = hour;
          if (hour !== 12) nonMilHour = hour - 12;
          const time = `${nonMilHour}:00 pm`;
          timeSetting.push(time);
        }
        else{
          const time = `${hour}:00 am`;
          timeSetting.push(time);
        }
      }
      setTimes(timeSetting);
    }
	}, [data, status]);


  return (
      <div className="availabilitySetter flex flex-col items-center justify-center px-2 py-0">
        <span> {`${day} ${newDay.getMonth() + 1}/${newDay.getDate()}`} </span>
        {status === "success" && times?.map((time, index) => <AvailButton key={index} text={time} day={day}> </AvailButton>)}
      </div>
    );
  };
/**
 * Doctor availabilty react component.
 * @returns JSX
 */
const Availability = ({user}: AvailPageProps) => {

  const { mutate } = api.storeAvail.storeAvails.useMutation();

  const realButtons = {
    border: "1px solid black", /* Green border */
    borderRadius: 20,
    color: "black", /* black text */
    padding: "5px 12px", /* Some padding */
    cursor: "pointer", /* Pointer/hand icon */
    display: "block", /* Make the buttons appear below each other */
  };
  /**
   * Send the desired availability to the database
   */
  const submitToDB = () => {
    const checkedBoxes = document.querySelectorAll('.selected');
    checkedBoxes.forEach(box => {
      const startTime = (box.classList[0] as string) + " " + (box.classList[1] as string);
      if (user.id) {
        const docId = user.id;
        const day = dayToNum[box.classList[2] as day];
        const data = {day,startTime,docId,weekCount};
        mutate(data);
        resetCheckedBoxes();
      }
    });
  };

  const [weekCount, setWeekCount] = useState(0);

  /**
   * Go to the previous page
   */
  const goBack = () => {
    router.back();
  };

  /**
   * reset all boxes to unchecked
   */
  function resetCheckedBoxes () {
    const checkedBoxes = document.querySelectorAll('.selected');
    checkedBoxes.forEach((check) => (check as HTMLElement).click());
  }
  /**
   * look at the previous weeks avail
   */
  const prevWeek = () => {
    setWeekCount(weekCount - 1);
    resetCheckedBoxes();
  };

  /**
   * look at the next weeks avail
   */
  const nextWeek = () => {
    setWeekCount(weekCount + 1);
    resetCheckedBoxes();
  };

  /**
   * look at current weeks avail
   */
  const resetWeek = () => {
    setWeekCount(0);
    resetCheckedBoxes();
  };

  const router = useRouter();

  return (
    <>
      <Head>
        <title>Set Availability</title>
        <meta name="description" content="Hospitality Doctor Availabilty" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen">
        <div className="flex flex-row items-center justify-center " >
          <div className="pt-5 pr-10 ">
            <button onClick={prevWeek} style={realButtons}> Previous Week </button>
          </div>
          <span className="text-2xl "> Set Your Availabilty </span>
          <div className="pt-5 pl-10 ">
            <button onClick={nextWeek} style={realButtons}> Next Week </button>
          </div>
        </div>
        <div className="flex justify-between pl-10 pr-10">
          <button onClick={goBack} style={realButtons}> Back </button>
          <button onClick={resetWeek} style={realButtons}> Current Week </button>
        </div>
        <div className="availabilitySetter flex flex-row items-center justify-center gap-2 px-2 py-0 ">
          <ColOfAvail day = "Sunday" week = {weekCount}> </ColOfAvail>
          <ColOfAvail day = "Monday" week = {weekCount}> </ColOfAvail>
          <ColOfAvail day = "Tuesday" week = {weekCount}> </ColOfAvail>
          <ColOfAvail day = "Wednesday" week = {weekCount}> </ColOfAvail>
          <ColOfAvail day = "Thursday" week = {weekCount}> </ColOfAvail>
          <ColOfAvail day = "Friday" week = {weekCount}> </ColOfAvail>
          <ColOfAvail day = "Saturday" week = {weekCount}> </ColOfAvail>
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
export const getServerSideProps: GetServerSideProps<AvailPageProps> = async (context: GetServerSidePropsContext) => {
  // Get the user session
  const session = await getSession(context);

  if (session?.user?.role !== "DOCTOR") {
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
};

export default Availability;
