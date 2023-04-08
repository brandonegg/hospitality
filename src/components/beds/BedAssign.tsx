import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { BedRowData } from "../../pages/beds";
import type { RouterInputs, RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import Alert from "../Alert";
import ErrorMessage from "../ErrorMessage";
import type { TablePopup } from "../tables/input";

import type { BedPopupTypes } from "./BedPopup";


type BedUpdateInput = RouterInputs["bed"]["update"];
type BedUpdateOutput = RouterOutputs["bed"]["update"];

interface BedEditProps {
  refetch: () => Promise<void>;
  bed?: BedRowData;
  popup: TablePopup<BedRowData, BedPopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<BedRowData, BedPopupTypes>>>;
}

/**
 * Component for searching patients
 */
const UserSearch = () => {
  return (
    <div className="flex flex-1 flex-col">
      <label htmlFor="user-search">Search for patient</label>
      <input
        type="text"
        id="user-search"
        placeholder="patient name"
        className="rounded border border-gray-300 p-2"
      />
    </div>
  );
};

/**
 * UserEdit component
 * @param param0
 * @returns JSX
 */
const BedAssign = ({ refetch, bed, setPopup }: BedEditProps) => {
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
      <Alert type="success">Successfully assigned patient!</Alert>
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
      <h2 className="text-xl font-semibold">Assign Patient to {bed?.room}</h2>

      <div className="flex flex-col items-stretch gap-2 sm:flex-row">

        <div className="flex flex-grow flex-col">
          <UserSearch />
          <div className="hidden">
            <input
              type="text"
              id="patient-id"
              className="rounded border border-gray-300 p-2"
              {...register("room", {
                required: "Please provide a patient to assign"
              })}
            />
            {errors.room?.message && (
              <ErrorMessage id={`$patient-id-error`}>
                {errors.room.message}
              </ErrorMessage>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-blue-600 py-2 px-3 font-semibold text-white hover:bg-blue-700"
        >
          Assign
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

export default BedAssign;
