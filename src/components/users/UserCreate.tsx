import { Role } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { UserRowData } from "../../pages/users";
import type { RouterInputs, RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import Alert from "../Alert";
import ErrorMessage from "../ErrorMessage";
import type { TablePopup } from "../tables/input";

import type { UserPopupTypes } from "./UserPopup";

type UserCreateInput = RouterInputs["user"]["create"];
type UserCreateOutput = RouterOutputs["user"]["create"];

interface UserCreateProps {
  refetch: () => Promise<void>;
  popup: TablePopup<UserRowData, UserPopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<UserRowData, UserPopupTypes>>>;
}

/**
 * UserCreate component
 * @returns JSX
 */
const UserCreate = ({ refetch, setPopup }: UserCreateProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    UserCreateOutput | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCreateInput>();

  const { mutate } = api.user.create.useMutation({
    onSuccess: async (data: UserCreateOutput) => {
      setServerResult(data);

      await refetch();
    },
    onError: (error) => setServerError(error.message),
  });

  /**
   * Form submit handler.
   * @param data Form data.
   * @returns
   */
  const onSubmit: SubmitHandler<UserCreateInput> = (data) => {
    mutate(data);
  };

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">Successfully created a user!</Alert>
      <button
        type="button"
        onClick={() => setPopup({ show: false })}
        className="inline-flex cursor-pointer items-center gap-2 rounded bg-red-600 py-2 px-3 font-semibold text-white hover:bg-red-700"
      >
        Close
      </button>
    </div>
  ) : (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      {/* server response error */}
      {serverError && <Alert type="error">{serverError}</Alert>}

      <h2 className="text-xl font-semibold">Name</h2>
      <div className="flex flex-col items-stretch gap-2 sm:flex-row">
        <div className="flex flex-grow flex-col">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            className="rounded border border-gray-300 p-2"
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
            id="lastName"
            className="rounded border border-gray-300 p-2"
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

        <div className="flex flex-grow flex-col">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            className="rounded border border-gray-300 p-[9.5px]"
            {...register("role", {
              required: "Role is required",
            })}
          >
            <option value={Role.PATIENT}>{Role.PATIENT}</option>
            <option value={Role.NURSE}>{Role.NURSE}</option>
            <option value={Role.DOCTOR}>{Role.DOCTOR}</option>
            <option value={Role.ADMIN}>{Role.ADMIN}</option>
          </select>
          {errors.role && (
            <ErrorMessage id="role-error">{errors.role.message}</ErrorMessage>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold">Other Information</h2>
      <div className="flex flex-col">
        <label htmlFor="dateOfBirth">Date of Birth</label>
        <input
          type="date"
          id="dateOfBirth"
          className="rounded border border-gray-300 p-2"
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

      <div className="flex flex-col items-stretch gap-2 sm:flex-row">
        <div className="flex flex-grow flex-col">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            className="rounded border border-gray-300 p-2"
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

        <div className="flex flex-grow flex-col">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="rounded border border-gray-300 p-2"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Email is invalid",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage id="email-error">{errors.email.message}</ErrorMessage>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="rounded border border-gray-300 p-2"
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

      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-blue-600 py-2 px-3 font-semibold text-white hover:bg-blue-700"
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={() => setPopup({ show: false })}
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-red-600 py-2 px-3 font-semibold text-white hover:bg-red-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserCreate;
