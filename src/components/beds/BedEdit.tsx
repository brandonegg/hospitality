import type { Bed} from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { RouterInputs, RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import Alert from "../Alert";
import { FormInput } from "../forms/input";
import type { TablePopup } from "../tables/input";

type BedUpdateInput = RouterInputs["bed"]["update"];
type BedUpdateOutput = RouterOutputs["bed"]["update"];

interface BedEditProps {
  refetch: () => Promise<void>;
  bed?: Bed;
  popup: TablePopup<Bed>;
  setPopup: Dispatch<SetStateAction<TablePopup<Bed>>>;
}

/**
 * UserEdit component
 * @param param0
 * @returns JSX
 */
const BedEdit = ({ refetch, bed, setPopup }: BedEditProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<BedUpdateOutput | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BedUpdateInput>({
    defaultValues: bed,
  });

  const { mutate } = api.bed.update.useMutation({
    onSuccess: async (data: BedUpdateOutput) => {
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
  const onSubmit: SubmitHandler<BedUpdateInput> = (data) => {
    mutate(data);
  };

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">Successfully updated bed!</Alert>
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
          <FormInput<BedUpdateInput>
            label="Room Label"
            registerDetails={{...register("room", {
                required: "Room label is required",
              })}}
            id="room"
            errorMessage={errors.room ? errors.room.message : undefined}
          />
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

export default BedEdit;
