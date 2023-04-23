import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { RouterInputs, RouterOutputs } from "../../lib/api";
import { api } from "../../lib/api";
import type { RateRowData } from "../../pages/rates";
import Alert from "../Alert";
import type { TablePopup } from "../tables/input";

import type { RatePopupTypes } from "./RatePopup";

interface RateDeleteProps {
  refetch: () => Promise<void>;
  rate?: RateRowData;
  popup: TablePopup<RateRowData, RatePopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<RateRowData, RatePopupTypes>>>;
}

type RateDeleteInput = RouterInputs["rate"]["delete"];
type RateDeleteOutput = RouterOutputs["rate"]["delete"];

/**
 * Rate delete component.
 * @returns
 */
const RateDelete = ({ refetch, rate, setPopup }: RateDeleteProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    RateDeleteOutput | undefined
  >(undefined);

  const { register, handleSubmit } = useForm<RateDeleteInput>();

  const { mutate } = api.rate.delete.useMutation({
    onSuccess: async (data: RateDeleteOutput) => {
      setServerResult(data);

      await refetch();
    },
    onError: (error) => setServerError(error.message),
  });

  /**
   * Form submit handler.
   */
  const onSubmit: SubmitHandler<RateDeleteInput> = (data) => {
    mutate(data);
  };

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">Successfully deleted rate!</Alert>
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

      <p>Do you want to delete this rate?</p>

      <div className="space-y-1">
        <div className="grid grid-cols-10">
          <p className="col-span-10 font-semibold sm:col-span-2">Name:</p>
          <p className="col-span-10 sm:col-span-8">{rate?.name}</p>
        </div>

        <div className="grid grid-cols-10">
          <p className="col-span-10 font-semibold sm:col-span-2">
            Description:
          </p>
          <p className="col-span-10 sm:col-span-8">{rate?.description}</p>
        </div>

        <div className="grid grid-cols-10">
          <p className="col-span-10 font-semibold sm:col-span-2">Price:</p>
          <p className="col-span-10 sm:col-span-8">{rate?.price}</p>
        </div>
      </div>

      <input type="hidden" value={rate?.id} {...register("id")} />

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

export default RateDelete;
