import type { Bed } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { RouterInputs, RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import Alert from "../Alert";
import type { TablePopup } from "../tables/input";

interface UserDeleteProps {
  refetch: () => Promise<void>;
  bed?: Bed;
  popup: TablePopup<Bed>;
  setPopup: Dispatch<SetStateAction<TablePopup<Bed>>>;
}

type UserDeleteInput = RouterInputs["user"]["delete"];
type UserDeleteOutput = RouterOutputs["user"]["delete"];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/**
 * UserDelete component
 * @param param0
 * @returns JSX
 */
const UserDelete = ({ refetch, bed, setPopup }: UserDeleteProps) => {
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

      <input type="hidden" value={bed?.id} {...register("id")} />

    </form>
  );
};

export default UserDelete;
