import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { RouterInputs, RouterOutputs } from "../../lib/api";
import { api } from "../../lib/api";
import type { BedRowData } from "../../pages/beds";
import Alert from "../Alert";
import type { TablePopup } from "../tables/input";

import type { BedPopupTypes } from "./BedPopup";

interface BedDeleteProps {
  refetch: () => Promise<void>;
  bed?: BedRowData;
  popup: TablePopup<BedRowData, BedPopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<BedRowData, BedPopupTypes>>>;
}

type BedDeleteInput = RouterInputs["bed"]["delete"];
type BedDeleteOutput = RouterOutputs["bed"]["delete"];

/**
 * BedDelete component
 * @param param0
 * @returns JSX
 */
const BedDelete = ({ refetch, bed, setPopup }: BedDeleteProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<BedDeleteOutput | undefined>(
    undefined
  );

  const { register, handleSubmit } = useForm<BedDeleteInput>();

  const { mutate } = api.bed.delete.useMutation({
    onSuccess: async (data: BedDeleteOutput) => {
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
  const onSubmit: SubmitHandler<BedDeleteInput> = (data) => {
    mutate(data);
  };

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">Successfully deleted bed!</Alert>
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

      <p>Do you want to this delete this bed?</p>

      <div className="space-y-1">
        <div className="grid grid-cols-10">
          <p className="col-span-10 font-semibold sm:col-span-2">Room Label:</p>
          <p className="col-span-10 sm:col-span-8">{bed?.room}</p>
        </div>
      </div>

      <input type="hidden" value={bed?.id} {...register("id")} />

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

export default BedDelete;
