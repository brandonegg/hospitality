import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { RouterInputs, RouterOutputs } from "../utils/api";
import { api } from "../utils/api";
import { classNames } from "../utils/text";

type SignUpInput = RouterInputs["user"]["signup"];
type SignUpOutput = RouterOutputs["user"]["signup"];

/**
 * Error message react component.
 * @param children Error message.
 * @returns JSX
 */
function ErrorMessage({
  id,
  children,
}: {
  id: string;
  children: string | undefined;
}) {
  return (
    <span id={id} className="text-sm text-red-500">
      {children}
    </span>
  );
}

/**
 * Alert react component.
 * @param type Alert type.
 * @param children Alert message.
 * @returns JSX
 */
function Alert({
  type,
  children,
}: {
  type: string;
  children: string | undefined;
}) {
  return (
    <div
      id={`alert-${type}`}
      className={classNames(
        "rounded border px-4 py-3",
        type === "success"
          ? "border-green-400 bg-green-100 text-green-700"
          : "border-red-400 bg-red-100 text-red-700"
      )}
      role="alert"
    >
      <span className="block sm:inline" id={`alert-${type}-message`}>
        {children}
      </span>
    </div>
  );
}

/**
 * Sign Up page react component.
 * @returns JSX
 */
const SignUp: NextPage = () => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<SignUpOutput | undefined>(
    undefined
  );

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignUpInput>({});

  const { mutate } = api.user.signup.useMutation({
    onSuccess: (data: SignUpOutput) => setServerResult(data),
    onError: (error) => setServerError(error.message),
  });

  /**
   * Form submit handler.
   * @param data Form data.
   * @returns
   */
  const onSubmit: SubmitHandler<SignUpInput> = (data) => {
    mutate(data);
  };

  return (
    <>
      <Head>
        <title>Sign Up</title>
        <meta name="description" content="Hospitality Sign Up" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex min-h-screen max-w-lg flex-col p-2">
        <div className="space-y-2 rounded-lg border border-gray-200 p-2">
          <div className="relative">
            <Link
              href="/"
              className="absolute rounded p-2 text-center text-indigo-500 hover:bg-indigo-100"
            >
              Back
            </Link>
            <h1 className="flex justify-center text-3xl font-bold">Sign Up</h1>
          </div>

          {serverResult ? (
            <div className="space-y-2">
              <Alert type="success">Successfully created account!</Alert>
              <button className="cursor-pointer rounded bg-indigo-500 p-2 text-white hover:bg-indigo-600">
                <Link href="/login">Login</Link>
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              {/* server response error */}
              {serverError && <Alert type="error">{serverError}</Alert>}

              <div className="flex items-stretch gap-2">
                <div className="flex flex-grow flex-col">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    className={classNames(
                      "rounded border border-gray-300 p-2",
                      errors.firstName ? "border-red-500" : ""
                    )}
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                  />
                  {errors.firstName && (
                    <ErrorMessage id="firstName-error">
                      {errors.firstName.message}
                    </ErrorMessage>
                  )}
                </div>

                <div className="flex flex-grow flex-col">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className={classNames(
                      "rounded border border-gray-300 p-2",
                      errors.lastName ? "border-red-500" : ""
                    )}
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                  />
                  {errors.lastName && (
                    <ErrorMessage id="lastName-error">
                      {errors.lastName.message}
                    </ErrorMessage>
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  className={classNames(
                    "rounded border border-gray-300 p-2",
                    errors.dateOfBirth ? "border-red-500" : ""
                  )}
                  {...register("dateOfBirth", {
                    required: "Date of birth is required",
                  })}
                />
                {errors.dateOfBirth && (
                  <ErrorMessage id="dateOfBirth-error">
                    {errors.dateOfBirth.message}
                  </ErrorMessage>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
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
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="johndoe@example.com"
                  className={classNames(
                    "rounded border border-gray-300 p-2",
                    errors.email ? "border-red-500" : ""
                  )}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Email is invalid",
                    },
                  })}
                />
                {errors.email && (
                  <ErrorMessage id="email-error">
                    {errors.email.message}
                  </ErrorMessage>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  className={classNames(
                    "rounded border border-gray-300 p-2",
                    errors.password ? "border-red-500" : ""
                  )}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                {errors.password && (
                  <ErrorMessage id="password-error">
                    {errors.password.message}
                  </ErrorMessage>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className={classNames(
                    "rounded border border-gray-300 p-2",
                    errors.confirmPassword ? "border-red-500" : ""
                  )}
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <ErrorMessage id="confirmPassword-error">
                    {errors.confirmPassword.message}
                  </ErrorMessage>
                )}
              </div>

              <button
                type="submit"
                value="Sign Up"
                className="cursor-pointer rounded bg-indigo-500 p-2 text-white hover:bg-indigo-600"
              >
                Sign Up
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  );
};

export default SignUp;
