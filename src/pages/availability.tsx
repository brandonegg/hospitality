import { type NextPage } from "next";
import Head from "next/head";
import React, { ButtonHTMLAttributes, useState } from 'react';


// sets the time ranges to be displayed by the ui, change i to start and stop during available to set hours in military time
// change minutes and j for different minutes. hour 7, <hour 20 means 7 to 7 can be marked as available
const times: string[] = [];
const minutes: string[] = ["00", "30"]
for (let hour = 7; hour < 20; hour++){
  for (let min = 0; min < 2; min++){
    if (!(hour === 19 && min === 1)){ //don't want to add 7:30s
      if (hour > 12) { // pm
        const nonMilHour = hour - 12;
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        const time = `${nonMilHour}:${minutes[min]} pm`;
        times.push(time);
      }
      else{ // am
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        const time = `${hour}:${minutes[min]} am`;
        times.push(time);
      }
    }
  }
}

/**
 * make a button for availability
 * @param props
 * @returns 
 */
const AvailButton = (props:{children:string, text:string}) => {
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
    border: active ? "1px solid black": "1px solid green",
    color: "black", /* black text */
    padding: "5px 12px", /* Some padding */
    cursor: "pointer", /* Pointer/hand icon */
    width: "100%",
    display: "block", /* Make the buttons appear below each other */
  };
  return (
    <button className={active ? "selected" : "boxes"} onClick={changeColor} style={buttonStyle}> {text} </button>
  );
}

/**
 * Like when2meet, a column of avaialability
 * @returns JSX
 */
const ColOfAvail = (props:{children:string, day:string}) => {
  const day = props.day;
  return (
      <div className="availabilitySetter flex flex-col items-center justify-center px-2 py-0">
        <span> {day} </span>
        {times.map((time, index) => <AvailButton key={index} text={time} > </AvailButton>)}
      </div>
    );
  }
/**
 * Doctor availabilty react component.
 * @returns JSX
 */
const Availability: NextPage = () => {
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
      const checkedBoxes:any = document.querySelectorAll('.selected');
      console.log("Submit pressed");
      console.log(checkedBoxes);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      console.log(checkedBoxes.getText().toString());
      
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
          <title>Set Availability</title>
          <meta name="description" content="Hospitality Doctor Availabilty" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <main className="min-h-screen">
          <div className="flex flex-row items-center justify-center " >
            <span className="text-2xl "> Set Your Availabilty </span>
          </div>
          <div className="flex flex-row h-20 w-32 ">
            <div className="pt-8 pl-10 ">
              <button onClick={goBack} style={realButtons}> Back </button>
            </div>
          </div>
          <div className="availabilitySetter flex flex-row items-center justify-center gap-2 px-2 py-0 ">
            <ColOfAvail day = "Sunday"> </ColOfAvail>
            <ColOfAvail day = "Monday"> </ColOfAvail>
            <ColOfAvail day = "Tuesday"> </ColOfAvail>
            <ColOfAvail day = "Wednesday"> </ColOfAvail>
            <ColOfAvail day = "Thursday"> </ColOfAvail>
            <ColOfAvail day = "Friday"> </ColOfAvail>
            <ColOfAvail day = "Saturday"> </ColOfAvail>
          </div>
          <div className="availabilitySetter flex flex-col items-center justify-center gap-2 pt-10 pb-10">
            <button onClick={submitToDB} style={realButtons}> Submit </button>
          </div>
        </main>
      </>
    );
  };
  
export default Availability;