import { type NextPage } from "next";
import Head from "next/head";
import React from 'react';

import type { HorizontalCarouselSlideProps } from "../components/HorizontalCarousel";
import HorizontalCarousel from "../components/HorizontalCarousel";
import NavigationBar from "../components/NavigationBar";

const slides: HorizontalCarouselSlideProps[] = [
  {
      backgroundImage: 'https://mcr.health/wp-content/uploads/2021/03/If-You-Cant-Get-a-Doctors-Appointment.jpg',
      body: <>
          <div className='h-full flex flex-col overflow-hidden'>
              <div className="flex-grow"></div>
              <div className="px-16 py-8 bg-gradient-to-t from-white/75 to-gray-100/0">
                <h1 className='text-black text-4xl font-bold'>Appointment Booking</h1>
                <p className='text-lg text-black'><i>Schedule appointments with your trusted provider quickly from the comfort of your device.</i></p>
              </div>
          </div>
      </>
  },
  {
      backgroundImage: 'https://healthcare.ascension.org/-/media/project/ascension/healthcare/legacy/markets/michigan/facility-images/mi_ascensionstjohn_hospital_detroit_22201morossrd_1600x1064px.jpg',
      body: <>
          <div className='h-full flex flex-col overflow-hidden'>
              <div className="flex-grow"></div>
              <div className="px-16 py-8 bg-gradient-to-t from-white/100 to-white/0">
                <h1 className='text-black text-4xl font-bold'>Keep Documents Updated</h1>
                <p className='text-lg text-black'><i>Ensure your documents are up-to-date before your next visit saving time in the waiting room.</i></p>
              </div>
          </div>
      </>
  },
  {
    backgroundImage: 'https://tt152.files.keap.app/tt152/2799b797-d1db-4128-bbc8-af43290f881c',
    body: <>
      <div className='h-full flex flex-col overflow-hidden'>
        <div className="flex-grow"></div>
        <div className="px-16 py-8 bg-gradient-to-t from-white/100 to-white/0">
          <h1 className='text-black text-4xl font-bold'>Request Refills</h1>
          <p className='text-lg text-black'><i>Manage your prescriptions and easily schedule appointments to simplify your refill process.</i></p>
        </div>
      </div>
    </>
  }
];

/**
 * Main homepage react component.
 * @returns JSX
 */
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Hospitality</title>
        <meta name="description" content="The ultimate hospital management system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-[1400px] mx-auto">
        <div id='header-content' className="m-6">
          <h2 className="mb-6 text-4xl font-semibold">Hospitality</h2>
          <NavigationBar loggedIn={false}/>
        </div>
        <div id='main-content' className="mx-6">
          <HorizontalCarousel slides={slides}/>
        </div>
      </main>
    </>
  );
};

export default Home;
