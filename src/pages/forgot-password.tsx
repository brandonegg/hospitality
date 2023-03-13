import { ArrowLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";

import ErrorMessage from "../components/ErrorMessage";
import { classNames } from "../utils/text";

/**
 * Forgot password page react component.
 * @returns JSX
 */
const ForgotPassword: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /**
   * Form submit handler.
   * @param data Form data.
   * @returns
   */
  const onSubmit = (data) => {
    console.log(data);
  };

  const router = useRouter();

  return (
    <>
      <Head>
        <title>Sign Up</title>
        <meta name="description" content="Hospitality Sign Up" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto min-h-screen max-w-3xl flex-col p-2">
        <div className="space-y-2 p-2">
          <div className="relative">
            <button
              onClick={() => router.back()}
              className="absolute inline-flex items-center gap-1 rounded p-2 text-center text-blue-600 hover:bg-blue-100"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </button>
            <h1 className="flex justify-center text-3xl font-bold">
              Can&apos;t Sign In?
            </h1>
          </div>

          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col">
              <label htmlFor="email">
                Enter your email address below and we&apos;ll send you password
                reset instructions.
              </label>
              <input
                type="email"
                placeholder="Email Address"
                className={classNames(
                  "rounded border border-gray-300 p-2",
                  errors.email ? "border-red-500" : ""
                )}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <ErrorMessage id="email-error">
                  {errors.email.message}
                </ErrorMessage>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                value="Sign Up"
                className="inline-flex cursor-pointer items-center gap-1 rounded bg-blue-600 p-2 text-white hover:bg-blue-700"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
                Send me reset instructions
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default ForgotPassword;
