import { type AppType } from "next/app";
import Head from "next/head";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";

import MainHeader from "../components/Header";
import { api } from "../utils/api";
import "../styles/globals.css";

/**
 * .
 * @param param0
 * @returns
 */
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
          <title>Hospitality</title>
          <meta name="description" content="The ultimate hospital management system" />
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <section className="max-w-[1400px] mx-auto">
          <MainHeader/>
        </section>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
