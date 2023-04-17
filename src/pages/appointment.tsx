/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { Availability, User } from "@prisma/client";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { type NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import type { Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export const timeSort = function (a: Availability, b: Availability) {
  // sort by date, then time
  if (new Date(a.date).getTime() == new Date(b.date).getTime()) {
    // same day, sort by time
    const aNums = a.startTime.split(" ")[0] as string;
    const bNums = b.startTime.split(" ")[0] as string;
    const aM = a.startTime.split(" ")[1] as string;
    const bM = b.startTime.split(" ")[1] as string;
    if (aM === bM) {
      if (aNums.split(":")[0] === bNums.split(":")[0])
        return (aNums.split(":")[1] as string).localeCompare(
          bNums.split(":")[1] as string
        ); // if same hour, sort by minutes
      if (parseInt(aNums.split(":")[0] as string) === 12) return -1; // if 12pm, put it at the beginning
      if (parseInt(bNums.split(":")[0] as string) === 12) return 1; // if 12pm, put it at the beginning
      return (
        parseInt(aNums.split(":")[0] as string) -
        parseInt(bNums.split(":")[0] as string)
      ); // if both am or both pm sort by time
    } else return aM.localeCompare(bM); // if one is am and one is pm, sort by am/pm
  } else return new Date(a.date).getTime() - new Date(b.date).getTime();
};

interface AppointPageProps {
  user: Session["user"];
}

const today = new Date();
const todayDay = today.getDay();

// convert from number used for storage and string used for display
const dayToNum = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};
type day =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

// sets the time ranges to be displayed by the ui, change i to start and stop during available to set hours in military time
// change minutes and j for different minutes. hour 7, <hour 20 means 7 to 7 can be marked as available
const times: Availability[] = [];
/**
 * instead of displaying all hours, grab the available times for the current doctor
 */
const getAvailability = async function (docId: string, weekCount = 0) {
  try {
    const body = { docId, weekCount };
    await fetch(`/api/getAvail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((avails: Availability[]) => {
        times.length = 0;
        avails.sort(timeSort);
        avails.forEach((time) => {
          times.push(time);
        });
      });
  } catch (error) {
    console.error(error);
  }
};
let availGetter = getAvailability("AllDoctors");

//
const doctors: User[] = [];
/**
 * instead of displaying all hours, grab the available times for the current doctor
 */
const getDoctors = async function () {
  try {
    const body = {};
    await fetch(`/api/getDoctors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((docs: User[]) => {
        doctors.length = 0;
        docs.forEach((doc) => {
          doctors.push(doc);
        });
      });
  } catch (error) {
    console.error(error);
  }
};
const docGetter = getDoctors();

/**
 * make a button for Appointment
 * @param props
 * @returns
 */
const AppointButton = (props: {
  children: string;
  text: string;
  day: string;
}) => {
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
    border: active ? "1px solid black" : "1px solid green",
    color: "black" /* black text */,
    padding: "5px 12px" /* Some padding */,
    cursor: "pointer" /* Pointer/hand icon */,
    width: "100%",
    display: "block" /* Make the buttons appear below each other */,
  };
  return (
    <button
      className={text + " " + day + " " + (active ? "selected" : "boxes")}
      onClick={changeColor}
      style={buttonStyle}
    >
      {" "}
      {text}{" "}
    </button>
  );
};

/**
 * Like when2meet, a column of appointments
 * @returns JSX
 */
const ColOfAppoint = (props: {
  children: string;
  day: string;
  week: number;
}) => {
  const day = props.day;
  const weekCount = props.week;
  const offset = todayDay - (dayToNum[day as day] + weekCount * 7);
  const newDay = new Date(today.getTime());
  newDay.setDate(newDay.getDate() - offset); // properly handles day and increments month when necessary

  const [dayTimes, updateTimes] = React.useState<string[]>([]);

  useEffect(() => {
    /**
     * Wait for available times to be fetched then display
     */
    async function getTimes() {
      //const weekCoun = weekCount;
      await availGetter;
      const thisDaysTimes = times.filter(
        (time) => time.day === dayToNum[day as day]
      );
      const thisDaysStartTimes = thisDaysTimes.map((time) => time.startTime);
      // when viewing all doctors you don't want mult. different chances to apply for same time
      const thisDaysUniqueTimes = [...new Set(thisDaysStartTimes)];
      updateTimes(thisDaysUniqueTimes);
    }
    void getTimes();
  }, [day, weekCount]);

  return (
    <div className="appointSetter flex flex-col items-center justify-center px-2 py-0">
      <span> {`${day} ${newDay.getMonth() + 1}/${newDay.getDate()}`} </span>
      {dayTimes.map((time, index) => (
        <AppointButton key={index} text={time} day={day}>
          {" "}
        </AppointButton>
      ))}
    </div>
  );
};
/**
 * Doctor availabilty react component.
 * @returns JSX
 */
const Appointment: NextPage = () => {
  const realButtons = {
    border: "1px solid black" /* Green border */,
    borderRadius: 20,
    color: "black" /* black text */,
    padding: "5px 12px" /* Some padding */,
    cursor: "pointer" /* Pointer/hand icon */,
    display: "block" /* Make the buttons appear below each other */,
  };

  const { data: sessionData } = useSession();
  /**
   * Send the desired Appointment to the database
   */
  const submitToDB = async () => {
    const checkedBoxes = document.querySelectorAll(".selected");
    const times: [string, number, string, number, string][] = [];
    checkedBoxes.forEach((box) => {
      const time =
        (box.classList[0] as string) + " " + (box.classList[1] as string);
      if (sessionData?.user?.id)
        times.push([
          time,
          dayToNum[box.classList[2] as day],
          doctor,
          weekCount,
          sessionData.user.id,
        ]); // also pass in the correct date here
      else console.error("Can't access user id to make appointment");
    });
    try {
      const body = { times };
      await fetch(`/api/storeAppoint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const [doctor, setValue] = React.useState("AllDoctors");

  const [weekCount, setWeekCount] = useState(0);

  /**
   * Go to the previous page
   */
  const goBack = async () => {
    await Router.push("/");
  };

  /**
   * reset all boxes to unchecked
   */
  function resetCheckedBoxes(weekCountUpdated: number) {
    const checkedBoxes = document.querySelectorAll(".selected");
    checkedBoxes.forEach((check) => (check as HTMLElement).click());
    availGetter = getAvailability(
      (document.getElementById("dropdown") as HTMLSelectElement).value,
      weekCountUpdated
    );
  }
  /**
   * look at the previous weeks avail
   */
  const prevWeek = () => {
    setWeekCount(weekCount - 1);
    resetCheckedBoxes(weekCount - 1);
  };

  /**
   * look at the next weeks avail
   */
  const nextWeek = () => {
    setWeekCount(weekCount + 1);
    resetCheckedBoxes(weekCount + 1);
  };

  /**
   * look at current weeks avail
   */
  const resetWeek = () => {
    setWeekCount(0);
    resetCheckedBoxes(0);
  };

  /**
   * update state when dropdown changes
   */
  const changeDropDown = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
    resetCheckedBoxes(weekCount);
  };

  const [docts, updateDocts] = React.useState<User[]>([]);

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      /**
       * Wait for available times to be fetched then display
       */
      async function getDoctors() {
        await docGetter;
        updateDocts(doctors);
      }
      void getDoctors();
    }
    return () => {
      ignore = true;
    };
  });

  return (
    <>
      <Head>
        <title>Set Appointment</title>
        <meta name="description" content="Hospitality Doctor Appointments" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen">
        <div className="flex flex-row items-center justify-center ">
          <div className="pt-5 pr-10 ">
            <button onClick={prevWeek} style={realButtons}>
              {" "}
              Previous Week{" "}
            </button>
          </div>
          <span className="text-2xl "> Make an Appointment </span>
          <div className="pt-5 pl-10 ">
            <button onClick={nextWeek} style={realButtons}>
              {" "}
              Next Week{" "}
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 h-16 w-40 pt-5 pr-20 ">
          <select id="dropdown" value={doctor} onChange={changeDropDown}>
            <option value="AllDoctors">Any Doctor</option>
            {docts.map((user, index) => (
              <option key={index} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-between pl-10 pr-10">
          <button onClick={goBack} style={realButtons}>
            {" "}
            Back{" "}
          </button>
          <button onClick={resetWeek} style={realButtons}>
            {" "}
            Current Week{" "}
          </button>
        </div>
        <div className="appointSetter flex flex-row items-start justify-center gap-2 px-2 py-0 ">
          <ColOfAppoint day="Sunday" week={weekCount}>
            {" "}
          </ColOfAppoint>
          <ColOfAppoint day="Monday" week={weekCount}>
            {" "}
          </ColOfAppoint>
          <ColOfAppoint day="Tuesday" week={weekCount}>
            {" "}
          </ColOfAppoint>
          <ColOfAppoint day="Wednesday" week={weekCount}>
            {" "}
          </ColOfAppoint>
          <ColOfAppoint day="Thursday" week={weekCount}>
            {" "}
          </ColOfAppoint>
          <ColOfAppoint day="Friday" week={weekCount}>
            {" "}
          </ColOfAppoint>
          <ColOfAppoint day="Saturday" week={weekCount}>
            {" "}
          </ColOfAppoint>
        </div>
        <div className="appointSetter flex flex-col items-center justify-center gap-2 pt-10 pb-10">
          <button
            onClick={() => {
              void submitToDB();
            }}
            style={realButtons}
          >
            {" "}
            Submit{" "}
          </button>
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
export const getServerSideProps: GetServerSideProps<AppointPageProps> = async (
  context: GetServerSidePropsContext
) => {
  // Get the user session
  const session = await getSession(context);

  if (session?.user?.role !== "PATIENT") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        user: session.user,
      },
    };
  }
};

export default Appointment;
