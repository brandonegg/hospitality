import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { RouterInputs, RouterOutputs } from "../../lib/api";
import { api } from "../../lib/api";
import type { MedsRowData } from "../../pages/meds";
import Alert from "../Alert";
import type { TablePopup } from "../tables/input";

import type { MedsPopupTypes } from "./MedsPopup";

interface MedsDeleteProps {
  refetch: () => Promise<void>;
  meds?: MedsRowData;
  popup: TablePopup<MedsRowData, MedsPopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<MedsRowData, MedsPopupTypes>>>;
}

type MedsDeleteInput = RouterInputs["meds"]["delete"];
type MedsDeleteOutput = RouterOutputs["meds"]["delete"];

/**
 * Medication delete component.
 * @returns
 */
const MedsDelete = ({ refetch, meds, setPopup }: MedsDeleteProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    MedsDeleteOutput | undefined
  >(undefined);

  const { register, handleSubmit } = useForm<MedsDeleteInput>();

  const { mutate } = api.meds.delete.useMutation({
    onSuccess: async (data: MedsDeleteOutput) => {
      setServerResult(data);

      await refetch();
    },
    onError: (error) => setServerError(error.message),
  });

  /**
   * Form submit handler.
   */
  const onSubmit: SubmitHandler<MedsDeleteInput> = (data) => {
    mutate(data);
  };

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">Successfully deleted medication!</Alert>
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

      <p>Do you want to delete this medication?</p>

      <div className="space-y-1">
        <div className="grid grid-cols-10">
          <p className="col-span-10 font-semibold sm:col-span-2">Name:</p>
          <p className="col-span-10 sm:col-span-8">{meds?.name}</p>
        </div>

        <div className="grid grid-cols-10">
          <p className="col-span-10 font-semibold sm:col-span-2">
            Minimum Dosage:
          </p>
          <p className="col-span-10 sm:col-span-8">{meds?.dosageMin}</p>
        </div>

        <div className="grid grid-cols-10">
          <p className="col-span-10 font-semibold sm:col-span-2">
            Maximum Dosage:
          </p>
          <p className="col-span-10 sm:col-span-8">{meds?.dosageMax}</p>
        </div>

        <div className="grid grid-cols-10">
          <p className="col-span-10 font-semibold sm:col-span-2">Unit:</p>
          <p className="col-span-10 sm:col-span-8">{meds?.unit}</p>
        </div>
      </div>

      <input type="hidden" value={meds?.id} {...register("id")} />

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

export default MedsDelete;
