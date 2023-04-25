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

type PrescribeUpdateInput = RouterInputs["prescribe"]["addItem"];
type PrescribeUpdateOutput = RouterOutputs["prescribe"]["addItem"];

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
const PrescribeAddBill = ({
  refetch,
  prescribe,
  setPopup,
}: PrescribeAddBillProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    PrescribeUpdateOutput | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PrescribeUpdateInput>({
    // fix default values
    defaultValues: {
      ...prescribe,
      dosage: "0",
    },
  });

  const { mutate } = api.prescribe.addItem.useMutation({
    onSuccess: async (data: PrescribeUpdateOutput) => {
      setServerResult(data);

      await refetch();
    },
    onError: (error) => setServerError(error.message),
  });

  /**
   * Form submit handler.
   */
  const onSubmit: SubmitHandler<PrescribeUpdateInput> = (data) => {
    mutate(data);
  };

  /**
   * update state when dropdown changes
   */
  const changeDropDown = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };

  const medsQuery = api.meds.getAll.useQuery();

  const [med, setValue] = useState("");

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">
        Successfully added medication to prescription!
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

      <div className="flex flex-row justify-between space-x-4">
        <div className="flex grow flex-col">
          <label htmlFor="medsId">Medication</label>
          <select
            id="medsId"
            value={med}
            className="rounded border border-gray-300 p-2"
            {...register("medsId", {
              required: "A medication is required",
            })}
            onChange={changeDropDown}
          >
            {medsQuery.data
              ? medsQuery.data.map((med, index) => (
                  <option key={index} value={med.id}>
                    {med.name}
                  </option>
                ))
              : undefined}
          </select>
          {errors.medsId && (
            <ErrorMessage id="medsId-error">
              {errors.medsId.message}
            </ErrorMessage>
          )}
        </div>

        {/** Quantity input */}
        <div className="flex grow flex-col">
          <label htmlFor="dosage">Dosage</label>
          <input
            id="dosage"
            type="number"
            className="rounded border border-gray-300 p-2"
            {...register("dosage", {
              required: "Dosage is required",
            })}
          >
            {/* add dosage here med.unit*/}
          </input>
          {errors.dosage && (
            <ErrorMessage id="dosage-error">
              {errors.dosage.message}
            </ErrorMessage>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-blue-600 py-2 px-3 font-semibold text-white hover:bg-blue-700"
        >
          Add
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

export default PrescribeAddBill;
