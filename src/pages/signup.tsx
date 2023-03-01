import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import Alert from "../components/Alert";
import ErrorMessage from "../components/ErrorMessage";
import type { RouterInputs, RouterOutputs } from "../utils/api";
import { api } from "../utils/api";
import { classNames } from "../utils/text";

// types
type SignUpInput = RouterInputs["user"]["signup"];
type SignUpOutput = RouterOutputs["user"]["signup"];

// states
const states = [
  { name: "", abbreviation: "" },
  { name: "Alabama", abbreviation: "AL" },
  { name: "Alaska", abbreviation: "AK" },
  { name: "American Samoa", abbreviation: "AS" },
  { name: "Arizona", abbreviation: "AZ" },
  { name: "Arkansas", abbreviation: "AR" },
  { name: "California", abbreviation: "CA" },
  { name: "Colorado", abbreviation: "CO" },
  { name: "Connecticut", abbreviation: "CT" },
  { name: "Delaware", abbreviation: "DE" },
  { name: "District Of Columbia", abbreviation: "DC" },
  { name: "Federated States Of Micronesia", abbreviation: "FM" },
  { name: "Florida", abbreviation: "FL" },
  { name: "Georgia", abbreviation: "GA" },
  { name: "Guam", abbreviation: "GU" },
  { name: "Hawaii", abbreviation: "HI" },
  { name: "Idaho", abbreviation: "ID" },
  { name: "Illinois", abbreviation: "IL" },
  { name: "Indiana", abbreviation: "IN" },
  { name: "Iowa", abbreviation: "IA" },
  { name: "Kansas", abbreviation: "KS" },
  { name: "Kentucky", abbreviation: "KY" },
  { name: "Louisiana", abbreviation: "LA" },
  { name: "Maine", abbreviation: "ME" },
  { name: "Marshall Islands", abbreviation: "MH" },
  { name: "Maryland", abbreviation: "MD" },
  { name: "Massachusetts", abbreviation: "MA" },
  { name: "Michigan", abbreviation: "MI" },
  { name: "Minnesota", abbreviation: "MN" },
  { name: "Mississippi", abbreviation: "MS" },
  { name: "Missouri", abbreviation: "MO" },
  { name: "Montana", abbreviation: "MT" },
  { name: "Nebraska", abbreviation: "NE" },
  { name: "Nevada", abbreviation: "NV" },
  { name: "New Hampshire", abbreviation: "NH" },
  { name: "New Jersey", abbreviation: "NJ" },
  { name: "New Mexico", abbreviation: "NM" },
  { name: "New York", abbreviation: "NY" },
  { name: "North Carolina", abbreviation: "NC" },
  { name: "North Dakota", abbreviation: "ND" },
  { name: "Northern Mariana Islands", abbreviation: "MP" },
  { name: "Ohio", abbreviation: "OH" },
  { name: "Oklahoma", abbreviation: "OK" },
  { name: "Oregon", abbreviation: "OR" },
  { name: "Palau", abbreviation: "PW" },
  { name: "Pennsylvania", abbreviation: "PA" },
  { name: "Puerto Rico", abbreviation: "PR" },
  { name: "Rhode Island", abbreviation: "RI" },
  { name: "South Carolina", abbreviation: "SC" },
  { name: "South Dakota", abbreviation: "SD" },
  { name: "Tennessee", abbreviation: "TN" },
  { name: "Texas", abbreviation: "TX" },
  { name: "Utah", abbreviation: "UT" },
  { name: "Vermont", abbreviation: "VT" },
  { name: "Virgin Islands", abbreviation: "VI" },
  { name: "Virginia", abbreviation: "VA" },
  { name: "Washington", abbreviation: "WA" },
  { name: "West Virginia", abbreviation: "WV" },
  { name: "Wisconsin", abbreviation: "WI" },
  { name: "Wyoming", abbreviation: "WY" },
];

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
      <main className="container mx-auto min-h-screen max-w-3xl flex-col p-2">
        <div className="space-y-2  p-2">
          <div className="relative">
            <Link
              href="/login"
              className="absolute inline-flex items-center gap-1 rounded p-2 text-center text-indigo-500 hover:bg-indigo-100"
            >
              <ArrowLeftIcon className="h-4 w-4" />
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

              <h2 className="text-xl font-semibold">Name</h2>
              <div className="flex items-stretch gap-2">
                {/* name */}
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

              <h2 className="text-xl font-semibold">Address</h2>
              {/* address */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex flex-grow flex-col">
                  <label htmlFor="street">Street Address</label>
                  <input
                    type="text"
                    placeholder="1234 Main St"
                    className={classNames(
                      "rounded border border-gray-300 p-2",
                      errors.street ? "border-red-500" : ""
                    )}
                    {...register("street", {
                      required: "Street address is required",
                    })}
                  />
                  {errors.street && (
                    <ErrorMessage id="street-error">
                      {errors.street.message}
                    </ErrorMessage>
                  )}
                </div>
              </div>

              {/* city, state, zip */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 flex flex-grow flex-col sm:col-span-4">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    placeholder="City"
                    className={classNames(
                      "rounded border border-gray-300 p-2",
                      errors.city ? "border-red-500" : ""
                    )}
                    {...register("city", {
                      required: "City is required",
                    })}
                  />
                  {errors.city && (
                    <ErrorMessage id="city-error">
                      {errors.city.message}
                    </ErrorMessage>
                  )}
                </div>

                <div className="col-span-12 flex flex-col sm:col-span-5">
                  <label htmlFor="state">State</label>
                  <select
                    className={classNames(
                      "h-[42px] rounded border border-gray-300 p-2",
                      errors.state ? "border-red-500" : ""
                    )}
                    {...register("state", {
                      required: "State is required",
                    })}
                  >
                    {states.map((state) => (
                      <option
                        key={state.abbreviation}
                        value={state.abbreviation}
                      >
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <ErrorMessage id="state-error">
                      {errors.state.message}
                    </ErrorMessage>
                  )}
                </div>

                <div className="col-span-12 flex flex-col sm:col-span-3">
                  <label htmlFor="zipCode">Zip Code</label>
                  <input
                    type="number"
                    placeholder="Zip"
                    maxLength={5}
                    className={classNames(
                      "rounded border border-gray-300 p-2",
                      errors.zipCode ? "border-red-500" : ""
                    )}
                    {...register("zipCode", {
                      required: "Zip is required",
                    })}
                  />
                  {errors.zipCode && (
                    <ErrorMessage id="zipCode-error">
                      {errors.zipCode.message}
                    </ErrorMessage>
                  )}
                </div>
              </div>

              <h2 className="text-xl font-semibold">Other Information</h2>
              {/* date of birth */}
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

              {/* username */}
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

              {/* email */}
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

              {/* password */}
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

              <div>
                <button
                  type="submit"
                  value="Sign Up"
                  className="cursor-pointer rounded bg-indigo-500 p-2 text-white hover:bg-indigo-600"
                >
                  Sign Up
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
};

export default SignUp;
