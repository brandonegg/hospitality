import { type NextPage } from "next";
import Head from "next/head";
import React from 'react';

import { api } from "../utils/api";

/**
 * Main homepage react component.
 * @returns JSX
 */
const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  return (
    <>
      <Head>
        <title>Hospitality</title>
        <meta name="description" content="The ultimate hospital management system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div>
          <p>
            {hello.data?.greeting}
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;
