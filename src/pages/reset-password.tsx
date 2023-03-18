import {
  ArrowRightOnRectangleIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import Alert from "../components/Alert";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import type { RouterInputs, RouterOutputs } from "../utils/api";
import { api } from "../utils/api";
import { classNames } from "../utils/text";

// types
type ResetPasswordInput = RouterInputs["user"]["resetPassword"];
type ResetPasswordOutput = RouterOutputs["user"]["resetPassword"];

/**
 * Reset password page react component.
 * @returns JSX
 */
const ResetPassword: NextPage = () => {
  const router = useRouter();
  const { token } = router.query;

  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    ResetPasswordOutput | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ResetPasswordInput>();

  const { error, isLoading } = api.user.checkResetToken.useQuery({
    token: (token || "") as string,
  });
  const { mutate } = api.user.resetPassword.useMutation({
    onSuccess: (data: ResetPasswordOutput) => setServerResult(data),
    onError: (error) => setServerError(error.message),
  });

  /**
   * Form submit handler.
   * @param data Form data.
   * @returns
   */
  const onSubmit: SubmitHandler<ResetPasswordInput> = (data) => {
    mutate(data);
  };

  if (error)
    return (
      <main className="container mx-auto min-h-screen max-w-3xl flex-col space-y-2 p-2">
        <h1 className="flex justify-center text-3xl font-bold">
          Password Reset
        </h1>
        <Alert type="error">{error.message}</Alert>
        <button className="cursor-pointer rounded bg-blue-600 p-2 text-white hover:bg-blue-700">
          <Link href="/" className="inline-flex items-center gap-1">
            Back to Home
          </Link>
        </button>
      </main>
    );

  if (isLoading) {
    return (
      // place holder loading animation
      <main className="container mx-auto min-h-screen max-w-3xl flex-col p-2">
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main className="container mx-auto min-h-screen max-w-3xl flex-col p-2">
      <div className="space-y-2 p-2">
        <h1 className="flex justify-center text-3xl font-bold">
          Password Reset
        </h1>

        {serverResult ? (
          <div className="space-y-2">
            <Alert type="success">Password updated!</Alert>
            <button className="cursor-pointer rounded bg-blue-600 p-2 text-white hover:bg-blue-700">
              <Link href="/" className="inline-flex items-center gap-1">
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Login
              </Link>
            </button>
          </div>
        ) : (
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* server response error */}
            {serverError && <Alert type="error">{serverError}</Alert>}

            <div className="flex flex-col">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                placeholder="New Password"
                className={classNames(
                  "rounded border border-gray-300 p-2",
                  errors.newPassword ? "border-red-500" : ""
                )}
                {...register("newPassword", {
                  required: "New Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              {errors.newPassword && (
                <ErrorMessage id="newPassword-error">
                  {errors.newPassword.message}
                </ErrorMessage>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="newPassword">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                className={classNames(
                  "rounded border border-gray-300 p-2",
                  errors.confirmPassword ? "border-red-500" : ""
                )}
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === getValues("newPassword") ||
                    "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <ErrorMessage id="confirmPassword-error">
                  {errors.confirmPassword.message}
                </ErrorMessage>
              )}
            </div>

            <input
              type="hidden"
              {...register("token")}
              defaultValue={token as string}
            />

            <div className="flex gap-2">
              <button
                type="submit"
                value="Sign Up"
                className="inline-flex cursor-pointer items-center gap-1 rounded bg-blue-600 p-2 text-white hover:bg-blue-700"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
                Submit New Password
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};

export default ResetPassword;
