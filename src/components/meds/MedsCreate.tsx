import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { RouterInputs, RouterOutputs } from "../../lib/api";
import { api } from "../../lib/api";
import type { MedsRowData } from "../../pages/meds";
import Alert from "../Alert";
import ErrorMessage from "../ErrorMessage";
import type { TablePopup } from "../tables/input";

import type { MedsPopupTypes } from "./MedsPopup";

type MedsCreateInput = RouterInputs["meds"]["create"];
type MedsCreateOutput = RouterOutputs["meds"]["create"];

interface MedsCreateProps {
  refetch: () => Promise<void>;
  popup: TablePopup<MedsRowData, MedsPopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<MedsRowData, MedsPopupTypes>>>;
}

/**
 * Meds delete component.
 * @returns
 */
const MedsCreate = ({ refetch, setPopup }: MedsCreateProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    MedsCreateOutput | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MedsCreateInput>();

  const { mutate } = api.meds.create.useMutation({
    onSuccess: async (data: MedsCreateOutput) => {
      setServerResult(data);

      await refetch();
    },
    onError: (error) => setServerError(error.message),
  });

  /**
   * Form submit handler.
   */
  const onSubmit: SubmitHandler<MedsCreateInput> = (data) => {
    mutate(data);
  };

  /**
   * update state when dropdown changes
   */
  const changeDropDown = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };

  const [unit, setValue] = useState("kg");

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">Successfully created a medication!</Alert>
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
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="rounded border border-gray-300 p-2"
            {...register("name", {
              required: "Name is required",
            })}
          />
          {errors.name && (
            <ErrorMessage id="name-error">{errors.name.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-grow flex-col">
          <label htmlFor="dosageMin">Minimum Dosage</label>
          <input
            id="dosageMin"
            type="number"
            className="resize-none rounded border border-gray-300 p-2"
            {...register("dosageMin", {
              required: "Minimum Dosage is required",
              pattern: {
                value: /^[0-9]+$/,
                message:
                  "Minimum Dosage must be a number with at least one digit",
              },
            })}
          />
          {errors.dosageMin && (
            <ErrorMessage id="dosageMin-error">
              {errors.dosageMin.message}
            </ErrorMessage>
          )}
        </div>

        <div className="flex flex-grow flex-col">
          <label htmlFor="dosageMax">Maximum Dosage</label>
          <input
            id="dosageMax"
            type="number"
            className="resize-none rounded border border-gray-300 p-2"
            {...register("dosageMax", {
              required: "Maximum Dosage is required",
              pattern: {
                value: /^[0-9]+$/,
                message:
                  "Maximum Dosage must be a number with at least one digit",
              },
            })}
          />
          {errors.dosageMax && (
            <ErrorMessage id="dosageMax-error">
              {errors.dosageMax.message}
            </ErrorMessage>
          )}
        </div>

        <div className="flex flex-grow flex-col">
          <label htmlFor="unit">Unit</label>
          <select
            id="unit"
            value={unit}
            className="rounded border border-gray-300 p-2"
            {...register("unit", {
              required: "Unit is required",
            })}
            onChange={changeDropDown}
          >
            <option value="g">kg</option>
            <option value="mg">mg</option>
            <option value="μg">μg</option>
            <option value="L">L</option>
            <option value="mL">mL</option>
            <option value="cc">cc</option>
            <option value="mol">mol</option>
            <option value="mmol">mmol</option>
          </select>
          {errors.unit && (
            <ErrorMessage id="unit-error">{errors.unit.message}</ErrorMessage>
          )}
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

export default MedsCreate;
