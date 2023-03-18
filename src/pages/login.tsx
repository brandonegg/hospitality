import {
  ArrowLeftIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import React, { useCallback, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import Alert from "../components/Alert";
import ErrorMessage from "../components/ErrorMessage";
import { classNames } from "../utils/text";
import type { LoginInput } from "../utils/validation/auth";

/**
 * Login page react component.
 * @returns JSX
 */
const Login: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({});

  const [error, setError] = useState<string | undefined>(undefined);

  /**
   * Form submit handler.
   * @param data Form data.
   * @returns
   */
  const onSubmit: SubmitHandler<LoginInput> = useCallback(async (data) => {
    try {
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
        callbackUrl: "/dashboard",
      });
      // error response
      if (res?.error) setError("Invalid username or password");

      // success response
      if (res?.ok) window.location.replace("/dashboard");
    } catch (err) {
      console.error(err);
    }
  }, []);

  const router = useRouter();

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Hospitality Login" />
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
            <h1 className="flex justify-center text-3xl font-bold">Login</h1>
          </div>

          {error && <Alert type="error">{error}</Alert>}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <div className="flex flex-col">
              <label htmlFor="username">Username</label>
              <input
                type="username"
                placeholder="johndoe"
                className={classNames(
                  "rounded border border-gray-300 p-2",
                  errors.username ? "border-red-500" : ""
                )}
                {...register("username", {
                  required: "Username is required",
                })}
              />
              {errors.username && (
                <ErrorMessage id="username-error">
                  {errors.username.message}
                </ErrorMessage>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="********"
                className={classNames(
                  "rounded border border-gray-300 p-2",
                  errors.password ? "border-red-500" : ""
                )}
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <ErrorMessage id="password-error">
                  {errors.password.message}
                </ErrorMessage>
              )}
            </div>

            <div className="flex items-center justify-between">
              {/* login and sign up button */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  value="Sign Up"
                  className="inline-flex cursor-pointer items-center gap-1 rounded bg-blue-600 p-2 text-white hover:bg-blue-700"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  Login
                </button>
                <Link
                  href="/signup"
                  className="inline-flex cursor-pointer items-center gap-1 rounded bg-blue-600 p-2 text-white hover:bg-blue-700"
                >
                  <UserPlusIcon className="h-4 w-4" />
                  Sign Up
                </Link>
              </div>

              {/* forgot password button */}
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:text-blue-700"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Login;
