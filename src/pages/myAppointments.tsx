import { Appointment } from "@prisma/client";
import Head from "next/head";
import Router from "next/router";
import type { GetServerSideProps, GetServerSidePropsContext } from "next/types";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import React, { useState } from "react";

import { timeSort } from "../pages/appointment";
import { api } from "../utils/api";

interface myAppointPageProps {
  user: Session["user"];
}
/**
 * Doctor availabilty react component.
 * @returns JSX
 */
const Appointment = ({ user }: myAppointPageProps) => {
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

  const { data } = api.getAppoint.getPatientAppoint.useQuery({
    userId: user.id,
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

  const { mutate } = api.myAppoint.removeAppoint.useMutation();

  /**
   * Remove an appointment
   */
  const remove = (sqlId: string) => {
    const index = appoints.findIndex((appoint) => appoint.id === sqlId);
    if (index > -1) appoints.splice(index, 1);
    mutate({ id: sqlId });
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
          <span className="text-2xl "> Your Appointments </span>
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
        <div className="inline-block flex justify-center">
          <div className="appoints flex flex-col items-start justify-center gap-2 px-2 py-0 ">
            {appoints?.map((appoint, index) => (
              <p key={index} className={appoint.id}>
                {new Date(
                  appoint.date.getTime() -
                    appoint.date.getTimezoneOffset() * -60000
                ).toDateString()}{" "}
                from {appoint.startTime}-{appoint.endTime}
              </p>
            ))}
          </div>
          <div className="appoints flex flex-col items-start justify-center gap-2 px-2 py-0 ">
            {appoints?.map((appoint, index) => (
              <button
                className={appoint.id}
                key={index}
                onClick={() => {
                  void remove(appoint.id);
                }}
              >
                {" "}
                X{" "}
              </button>
            ))}
          </div>
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
export const getServerSideProps: GetServerSideProps<
  myAppointPageProps
> = async (context: GetServerSidePropsContext) => {
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
