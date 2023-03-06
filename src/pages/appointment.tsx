import { type NextPage } from "next";
import Head from "next/head";
import Router from 'next/router'
import React, { useState } from 'react';


// sets the time ranges to be displayed by the ui, change i to start and stop during available to set hours in military time
// change minutes and j for different minutes. hour 7, <hour 20 means 7 to 7 can be marked as available
const times: string[] = [];
const minutes: string[] = ["00", "30"]
for (let hour = 7; hour < 20; hour++){
  for (let min = 0; min < 2; min++){
    if (!(hour === 19 && min === 1)){ //don't want to add 7:30s
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
}

/**
 * make a button for Appointment
 * @param props
 * @returns 
 */
const AppointButton = (props:{children:string, text:string, day:string }) => {
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
}

/**
 * Like when2meet, a column of appointments
 * @returns JSX
 */
const ColOfAppoint = (props:{children:string, day:string}) => {
  const day = props.day;
  return (
      <div className="appointSetter flex flex-col items-center justify-center px-2 py-0">
        <span> {day} </span>
        {times.map((time, index) => <AppointButton key={index} text={time} day={day}> </AppointButton>)}
      </div>
    );
  }
/**
 * Doctor availabilty react component.
 * @returns JSX
 */
const Appointment: NextPage = () => {
    const realButtons = {
      border: "1px solid black", /* Green border */
      borderRadius: 20,
      color: "black", /* black text */
      padding: "5px 12px", /* Some padding */
      cursor: "pointer", /* Pointer/hand icon */
      display: "block", /* Make the buttons appear below each other */
    };
    /**
     * Send the desired Appointment to the database
     */
    const submitToDB = async () => {
      const checkedBoxes = document.querySelectorAll('.selected');
      console.log("Submit pressed");
      const tempDocId = parseInt(doctor); // this will have to change in the future once doctors actually are created and have unique ids
      const times:[string,number,number][] = [];
      const dayToNum = {Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6}
      type day = "Sunday"|"Monday"|"Tuesday"|"Wednesday"|"Thursday"|"Friday"|"Saturday";
      checkedBoxes.forEach(box => {
        const time = (box.classList[0] as string) + " " + (box.classList[1] as string);
        times.push([time, dayToNum[box.classList[2] as day], tempDocId]);
      })
      try {
        const body = { times }
        await fetch(`/api/storeAppoint`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        await Router.push('/')
      } catch (error) {
        console.error(error)
      }
    }
    /**
     * Go to the previous page  
     */
    const goBack = () => {
      //
      console.log("Back pressed");
    };
    const [doctor, setValue] = React.useState("1");

    /**
     * update state when dropdown changes
     */
    const changeDropDown = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setValue(event.target.value);
    };
    return (
      <>
        <Head>
          <title>Set Appointment</title>
          <meta name="description" content="Hospitality Doctor Appointments" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <main className="min-h-screen">
          <div className="flex flex-row items-center justify-center " >
            <span className="text-2xl "> Make an Appointment </span>
          </div>
          <div className="absolute top-0 right-0 h-16 w-16 pt-10 pr-20 ">
            <select value={doctor} onChange={changeDropDown}>
              <option value="1">Doctor 1</option>
              <option value="2">Doctor 2</option>
              <option value="3">Doctor 3</option>
            </select>
          </div>
          <div className="flex flex-row h-20 w-32 ">
            <div className="pt-8 pl-10 ">
              <button onClick={goBack} style={realButtons}> Back </button>
            </div>
          </div>
          <div className="appointSetter flex flex-row items-center justify-center gap-2 px-2 py-0 ">
            <ColOfAppoint day = "Sunday"> </ColOfAppoint>
            <ColOfAppoint day = "Monday"> </ColOfAppoint>
            <ColOfAppoint day = "Tuesday"> </ColOfAppoint>
            <ColOfAppoint day = "Wednesday"> </ColOfAppoint>
            <ColOfAppoint day = "Thursday"> </ColOfAppoint>
            <ColOfAppoint day = "Friday"> </ColOfAppoint>
            <ColOfAppoint day = "Saturday"> </ColOfAppoint>
          </div>
          <div className="appointSetter flex flex-col items-center justify-center gap-2 pt-10 pb-10">
            <button onClick={() => { void submitToDB(); }} style={realButtons}> Submit </button>
          </div>
        </main>
      </>
    );
  };
  
export default Appointment;