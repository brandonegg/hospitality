import type { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { RouterInputs, RouterOutputs } from "../../lib/api";
import { api } from "../../lib/api";
import type { BedRowData } from "../../pages/beds";
import Alert from "../Alert";
import ErrorMessage from "../ErrorMessage";
import type { UserSearchOutput } from "../forms/input";
import { UserSearch } from "../forms/input";
import type { TablePopup } from "../tables/input";

import type { BedPopupTypes } from "./BedPopup";

type BedAssignInput = RouterInputs["bed"]["assign"];
type BedAssignOutput = RouterOutputs["bed"]["assign"];

interface BedAssignProps {
  refetch: () => Promise<void>;
  bed?: BedRowData;
  popup: TablePopup<BedRowData, BedPopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<BedRowData, BedPopupTypes>>>;
}

/**
 * UserEdit component
 * @param param0
 * @returns JSX
 */
const BedAssign = ({ refetch, bed, setPopup }: BedAssignProps) => {
  const [selectedPatient, setPatient] = useState<
    UserSearchOutput[number] | undefined
  >(
    bed?.occupant
      ? {
          id: bed.occupant.id,
          name: bed.occupant.name,
          dateOfBirth: bed.occupant.dateOfBirth,
        }
      : undefined
  );
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<BedAssignOutput | undefined>(
    undefined
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BedAssignInput>();

  const { mutate } = api.bed.assign.useMutation({
    onSuccess: async (data: BedAssignOutput) => {
      setServerResult(data);

      await refetch();
    },
    onError: (error) => setServerError(error.message),
  });

  useEffect(() => {
    // update the patientID state with the watched patientId field
    setValue("bedId", bed?.id ?? "");
    setValue("patientId", selectedPatient?.id ?? "");
  }, [bed, selectedPatient, setValue]);

  /**
   * Form submit handler.
   * @param data Form data.
   * @returns
   */
  const onSubmit: SubmitHandler<BedAssignInput> = (data) => {
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
          <UserSearch
            selectedPatient={selectedPatient}
            setPatient={setPatient}
          />
          {errors.patientId?.message && (
            <ErrorMessage id={`$patient-id-error`}>
              {errors.patientId.message}
            </ErrorMessage>
          )}

          <div className="hidden">
            {/** Hidden patientID field selected by search results */}
            <input
              type="text"
              id="patientId"
              className="rounded border border-gray-300 p-2"
              {...register("patientId", {})}
            />

            {/** Hidden bed ID field */}
            {bed?.id ? (
              <input
                type="text"
                id="bedId"
                value={bed.id ?? ""}
                className="rounded border border-gray-300 p-2"
                {...register("bedId", {
                  required: "Internal error occured, no bed ID provided.",
                  minLength: 1,
                })}
              />
            ) : undefined}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-blue-600 py-2 px-3 font-semibold text-white hover:bg-blue-700"
        >
          {bed?.userId && !selectedPatient?.id ? "Unassign" : "Assign"}
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
