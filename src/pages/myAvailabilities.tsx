import type { Appointment } from "@prisma/client";
import Head from "next/head";
import Router from "next/router";
import type { GetServerSideProps, GetServerSidePropsContext } from "next/types";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import React, { useState } from "react";

import { api } from "../lib/api";
import { timeSort } from "../pages/appointment";

interface myAvailPageProps {
  user: Session["user"];
}

/**
 * Doctor availabilty react component.
 * @returns JSX
 */
const MyAvailability = ({ user }: myAvailPageProps) => {
  const realButtons = {
    border: "1px solid black" /* Green border */,
    borderRadius: 20,
    color: "black" /* black text */,
    padding: "5px 12px" /* Some padding */,
    cursor: "pointer" /* Pointer/hand icon */,
    display: "block" /* Make the buttons appear below each other */,
  };

  let appoints: Appointment[] | [] = [];

  const [weekCount, setWeekCount] = useState(0);

  const { data } = api.getAppoint.getDocAvail.useQuery({
    docId: user.id,
    weekCount: weekCount,
  });

  // || [] so sort doesn't break when data is undefined
  appoints = (data as Appointment[]) || [];
  appoints.sort(timeSort);

  /**
   * Go to the previous page
   */
  const goBack = async () => {
    await Router.push("/");
  };

  /**
   * look at the previous weeks avail
   */
  const prevWeek = () => {
    setWeekCount(weekCount - 1);
  };

  /**
   * look at the next weeks avail
   */
  const nextWeek = () => {
    setWeekCount(weekCount + 1);
  };

  /**
   * look at current weeks avail
   */
  const resetWeek = () => {
    setWeekCount(0);
  };

  return (
    <>
      <Head>
        <title>See Appointment</title>
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
          <span className="text-2xl "> Your Availability </span>
          <div className="pt-5 pl-10 ">
            <button onClick={nextWeek} style={realButtons}>
              {" "}
              Next Week{" "}
            </button>
          </div>
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
        <div className="appoints flex flex-row flex-wrap items-start justify-center gap-2 px-2 py-0 ">
          {appoints?.map((appoint, index) => (
            <p key={index} className={appoint.id + " w-1/3"}>
              {new Date(
                appoint.date.getTime() -
                  appoint.date.getTimezoneOffset() * -60000
              ).toDateString()}{" "}
              from {appoint.startTime}-{appoint.endTime}
            </p>
          ))}
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
export const getServerSideProps: GetServerSideProps<myAvailPageProps> = async (
  context: GetServerSidePropsContext
) => {
  // Get the user session
  const session = await getSession(context);

  if (session?.user?.role !== "DOCTOR") {
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

export default MyAvailability;
