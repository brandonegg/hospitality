import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { UserRowData } from "../../pages/users";
import type { RouterInputs, RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import { dateFormatter } from "../../utils/date";
import Alert from "../Alert";
import type { TablePopup } from "../tables/input";

import type { UserPopupTypes } from "./UserPopup";

interface UserDeleteProps {
  refetch: () => Promise<void>;
  user?: UserRowData;
  popup: TablePopup<UserRowData, UserPopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<UserRowData, UserPopupTypes>>>;
}

type UserDeleteInput = RouterInputs["user"]["delete"];
type UserDeleteOutput = RouterOutputs["user"]["delete"];

/**
 * UserDelete component
 * @param param0
 * @returns JSX
 */
const UserDelete = ({ refetch, user, setPopup }: UserDeleteProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    UserDeleteOutput | undefined
  >(undefined);

  const { register, handleSubmit } = useForm<UserDeleteInput>();

  const { mutate } = api.user.delete.useMutation({
    onSuccess: async (data: UserDeleteOutput) => {
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
  const onSubmit: SubmitHandler<UserDeleteInput> = (data) => {
    mutate(data);
  };

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">Successfully deleted a user!</Alert>
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

      <p>Do you want to this delete this user?</p>

      <input type="hidden" value={user?.id} {...register("id")} />

      <div className="space-y-1">
        <div className="grid grid-cols-10">
          <p className="col-span-10 font-semibold sm:col-span-2">Name:</p>
          <p className="col-span-10 sm:col-span-8">{user?.name}</p>
        </div>

        <div className="grid grid-cols-10">
          <p className="col-span-10 font-semibold sm:col-span-2">Email:</p>
          <p className="col-span-10 sm:col-span-8">{user?.email}</p>
        </div>

        <div className="grid grid-cols-10">
          <p className="col-span-10 font-semibold sm:col-span-2">
            Date of Birth:
          </p>
          <p className="col-span-10 sm:col-span-8">
            {dateFormatter.format(user?.dateOfBirth as Date)}
          </p>
        </div>

        <div className="grid grid-cols-10">
          <p className="col-span-10 font-semibold sm:col-span-2">Role:</p>
          <p className="col-span-10 sm:col-span-8">{user?.role}</p>
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

export default UserDelete;
