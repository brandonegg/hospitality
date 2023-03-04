import { type NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";

// sets the time ranges to be displayed by the ui, change i to start and stop during available to set hours in military time
// change minutes and j for different minutes. hour 7, <hour 20 means 7 to 7 can be marked as available
const times: string[] = [];
const minutes: string[] = ["00", "30"];
for (let hour = 7; hour < 20; hour++) {
  for (let min = 0; min < 2; min++) {
    if (!(hour === 19 && min === 1)) {
      //don't want to add 7:30s
      if (hour > 12) {
        // pm
        const nonMilHour = hour - 12;
        const time = `${nonMilHour}:${minutes[min] as string} pm`;
        times.push(time);
      } else {
        // am
        const time = `${hour}:${minutes[min] as string} am`;
        times.push(time);
      }
    }
  }
}
// add something that removes times that are no longer available because doctors didn't say they were available or because
// another appointment was made

/**
 * make a button for Appointment
 * @param props
 * @returns
 */
function AppointButton(props: { children: string; text: string }) {
  const text = props.text;
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
    <button onClick={changeColor} style={buttonStyle}>
      {" "}
      {text}{" "}
    </button>
  );
}

/**
 * Like when2meet, a column of avaialability
 * @returns JSX
 */
const ColOfAppoint = (props: { children: string; day: string }) => {
  const day = props.day;
  return (
    <div className="AppointmentSetter flex flex-col items-center justify-center px-2 py-0">
      <span> {day} </span>
      {times.map((time, index) => (
        <AppointButton key={index} text={time}>
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
  /**
   * Send the desired Appointment to the database
   */
  const submitToDB = () => {
    //
    console.log("Submit pressed");
  };
  /**
   * Go to the previous page
   */
  const goBack = () => {
    //
    console.log("Back pressed");
  };
  return (
    <>
      <Head>
        <title>Make Appointment</title>
        <meta name="description" content="Hospitality Appointment" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen">
        <div className="flex flex-row items-center justify-center ">
          <span className="text-2xl "> Appointment Signup </span>
        </div>
        <div className="flex h-20 w-32 flex-row ">
          <div className="pt-8 pl-10 ">
            <button onClick={goBack} style={realButtons}>
              {" "}
              Back{" "}
            </button>
          </div>
        </div>
        <div className="AppointmentSetter flex flex-row items-center justify-center gap-2 px-2 py-0 ">
          <ColOfAppoint day="Sunday"> </ColOfAppoint>
          <ColOfAppoint day="Monday"> </ColOfAppoint>
          <ColOfAppoint day="Tuesday"> </ColOfAppoint>
          <ColOfAppoint day="Wednesday"> </ColOfAppoint>
          <ColOfAppoint day="Thursday"> </ColOfAppoint>
          <ColOfAppoint day="Friday"> </ColOfAppoint>
          <ColOfAppoint day="Saturday"> </ColOfAppoint>
        </div>
        <div className="availabilitySetter flex flex-col items-center justify-center gap-2 pt-10 pb-10">
          <button onClick={submitToDB} style={realButtons}>
            {" "}
            Submit{" "}
          </button>
        </div>
      </main>
    </>
  );
};

export default Appointment;
