import { type NextPage } from "next";
import Head from "next/head";
import React from 'react';

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
      <main>
        <div id='header-content'>
          <NavigationBar loggedIn={false}/>
        </div>
      </main>
    </>
  );
};

export default Home;
