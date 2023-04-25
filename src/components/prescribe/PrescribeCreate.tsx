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

type PrescribeCreateInput = RouterInputs["prescribe"]["create"];
type PrescribeCreateOutput = RouterOutputs["prescribe"]["create"];

interface PrescribeCreateProps {
  refetch: () => Promise<void>;
  popup: TablePopup<PrescribeRowData, PrescribePopupTypes>;
  setPopup: Dispatch<
    SetStateAction<TablePopup<PrescribeRowData, PrescribePopupTypes>>
  >;
}

/**
 * Prescribe delete component.
 * @returns
 */
const PrescribeCreate = ({ refetch, setPopup }: PrescribeCreateProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    PrescribeCreateOutput | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PrescribeCreateInput>();

  const { mutate } = api.prescribe.create.useMutation({
    onSuccess: async (data: PrescribeCreateOutput) => {
      setServerResult(data);

      await refetch();
    },
    onError: (error) => setServerError(error.message),
  });

  const patientsQuery = api.user.getAllPatients.useQuery();

  /**
   * Form submit handler.
   */
  const onSubmit: SubmitHandler<PrescribeCreateInput> = (data) => {
    mutate(data);
  };

  /**
   * update state when dropdown changes
   */
  const changeDropDown = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };

  const [patient, setValue] = useState("");

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">Successfully created a Prescribe!</Alert>
      <button
        type="button"
        onClick={() => {
          setPopup({ show: false });
        }}
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
          <label htmlFor="userId">User</label>
          <select
            id="userId"
            value={patient}
            className="rounded border border-gray-300 p-2"
            {...register("userId", {
              required: "User is required",
            })}
            onChange={changeDropDown}
          >
            {patientsQuery.data
              ? patientsQuery.data.map((user, index) => (
                  <option key={index} value={user.id}>
                    {user.name}
                  </option>
                ))
              : undefined}
          </select>
          {errors.userId && (
            <ErrorMessage id="user-error">{errors.userId.message}</ErrorMessage>
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

export default PrescribeCreate;
