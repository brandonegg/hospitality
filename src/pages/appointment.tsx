import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { ReactElement, useState } from 'react';


import { api } from "../utils/api";
/**
 * make a button for availability
 * @param props
 * @returns 
 */
function AvailButton(props:{children:string, text:string}) {
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
    border: "1px solid green", /* Green border */
    color: "black", /* black text */
    padding: "5px 12px", /* Some padding */
    cursor: "pointer", /* Pointer/hand icon */
    width: "100%",
    display: "block", /* Make the buttons appear below each other */
  };
  return (
    <button onClick={changeColor} style={buttonStyle}> {text} </button>
  );
}
/**
 * Like when2meet, a column of avaialability
 * @returns JSX
 */
function ColOfAvail(props:{children:string, day:string}) {
  const day = props.day
  return (
      <div className="availabilitySetter flex flex-col items-center justify-center px-2 py-0">
        <span> {day} </span>
        <AvailButton text= "9:00 am">  </AvailButton>
        <AvailButton text= "9:30 am"> </AvailButton>
        <AvailButton text= "10:00 am"> </AvailButton>
        <AvailButton text= "10:30 am"> </AvailButton>
        <AvailButton text= "11:00 am"> </AvailButton>
        <AvailButton text= "11:30 am"> </AvailButton>
        <AvailButton text= "12:00 pm"> </AvailButton>
        <AvailButton text= "12:30 pm"> </AvailButton>
        <AvailButton text= "1:00 pm"> </AvailButton>
        <AvailButton text= "1:30 pm"> </AvailButton>
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
          <title>Set Availability</title>
          <meta name="description" content="Hospitality Doctor Availabilty" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <main className="min-h-screen">
          <div className="flex flex-row items-center justify-center " >
            <span className="text-2xl "> Set Your Availabiilty </span>
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
          <div className="availabilitySetter flex flex-col items-center justify-center gap-2 pt-10 ">
            <button onClick={submitToDB} style={realButtons}> Submit </button>
          </div>
        </main>
      </>
    );
  };
  
export default Availability;