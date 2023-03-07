import { type NextPage } from "next";
import Head from "next/head";
import React from 'react';

import HorizontalCarousel from "../components/HorizontalCarousel";
import NavigationBar from "../components/NavigationBar";

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
          <HorizontalCarousel/>
        </div>
      </main>
    </>
  );
};

export default Home;
