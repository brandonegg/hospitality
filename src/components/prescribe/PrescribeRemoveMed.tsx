import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { RouterInputs, RouterOutputs } from "../../lib/api";
import { api } from "../../lib/api";
import type { PrescribeRowData } from "../../pages/prescribe/index";
import Alert from "../Alert";
import ErrorMessage from "../ErrorMessage";
import type { TablePopup } from "../tables/input";

import type { PrescribePopupTypes } from "./PrescribePopup";

type PrescribeRemoveBillInput = RouterInputs["prescribe"]["removeItem"];
type PrescribeRemoveBillOutput = RouterOutputs["prescribe"]["removeItem"];

interface PrescribeAddBillProps {
  refetch: () => Promise<void>;
  prescribe?: PrescribeRowData;
  popup: TablePopup<PrescribeRowData, PrescribePopupTypes>;
  setPopup: Dispatch<
    SetStateAction<TablePopup<PrescribeRowData, PrescribePopupTypes>>
  >;
}

/**
 * Prescribe add to bill component.
 * @returns
 */
const PrescribeRemoveBill = ({
  refetch,
  prescribe,
  setPopup,
}: PrescribeAddBillProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    PrescribeRemoveBillOutput | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PrescribeRemoveBillInput>({
    // fix default values
    defaultValues: {
      ...prescribe,
      id: prescribe?.id ?? "",
    },
  });

  const { mutate } = api.prescribe.removeItem.useMutation({
    onSuccess: async (data: PrescribeRemoveBillOutput) => {
      setServerResult(data);

      await refetch();
    },
    onError: (error) => setServerError(error.message),
  });

  /**
   * Form submit handler.
   */
  const onSubmit: SubmitHandler<PrescribeRemoveBillInput> = (data) => {
    mutate(data);
  };

  /**
   * update state when dropdown changes
   */
  const changeDropDown = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };

  const [procedure, setValue] = useState("");

  const { data: procedures } = api.prescribe.getProcedures.useQuery({
    id: prescribe?.id ?? "",
  });

  console.log(procedures);
  console.log(prescribe?.id);

  if (procedures == undefined) {
    return <div />;
  }

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">
        Successfully removed medication from prescription!
      </Alert>
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

      <div className="flex-1">
        <div className="flex flex-grow flex-col">
          <label htmlFor="medItemId">Medication - Name x dosage</label>
          <select
            id="medItemId"
            value={procedure}
            className="rounded border border-gray-300 p-2"
            {...register("medItemId", {
              required: "A medication is required",
            })}
            onChange={changeDropDown}
          >
            {procedures.map((medItem, index) => (
              <option key={index} value={medItem.id}>
                {medItem.meds.name} x {medItem.dosage} {medItem.meds.unit}
              </option>
            ))}
          </select>
          {errors.medItemId && (
            <ErrorMessage id="rate-error">
              {errors.medItemId.message}
            </ErrorMessage>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-blue-600 py-2 px-3 font-semibold text-white hover:bg-blue-700"
        >
          Remove
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

export default PrescribeRemoveBill;
