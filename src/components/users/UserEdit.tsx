import { Role } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { Popup, User } from "../../pages/users";
import type { RouterInputs, RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import Alert from "../Alert";
import ErrorMessage from "../ErrorMessage";

type UserUpdateInput = RouterInputs["user"]["update"];
type UserUpdateOutput = RouterOutputs["user"]["update"];

interface UserEditProps {
  refetch: () => Promise<void>;
  user?: User;
  popup: Popup;
  setPopup: Dispatch<SetStateAction<Popup>>;
}

/**
 * UserEdit component
 * @param param0
 * @returns JSX
 */
const UserEdit = ({ refetch, user, setPopup }: UserEditProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    UserUpdateOutput | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserUpdateInput>({
    defaultValues: user,
  });

  const { mutate } = api.user.update.useMutation({
    onSuccess: async (data: UserUpdateOutput) => {
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
  const onSubmit: SubmitHandler<UserUpdateInput> = (data) => {
    mutate(data);
  };

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">Successfully update a user!</Alert>
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

      <div className="flex flex-col items-stretch gap-2 sm:flex-row">
        <div className="flex flex-grow flex-col">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="rounded border border-gray-300 p-2"
            {...register("name", {
              required: "Name is required",
            })}
          />
          {errors.name && (
            <ErrorMessage id="name-error">{errors.name.message}</ErrorMessage>
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

export default UserEdit;
