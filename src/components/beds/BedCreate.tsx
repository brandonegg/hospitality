import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { BedRowData } from "../../pages/beds";
import type { RouterInputs, RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import Alert from "../Alert";
import { FormGap, FormInput } from "../forms/input";
import type { TablePopup } from "../tables/input";

type BedCreateInput = RouterInputs["bed"]["create"];
type BedCreateOutput = RouterOutputs["bed"]["create"];

interface BedCreateProps {
  refetch: () => Promise<void>;
  popup: TablePopup<BedRowData>;
  setPopup: Dispatch<SetStateAction<TablePopup<BedRowData>>>;
}

/**
 * UserCreate component
 * @returns JSX
 */
const BedCreate = ({ refetch, setPopup }: BedCreateProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<BedCreateInput | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BedCreateInput>();

  const { mutate } = api.bed.create.useMutation({
    onSuccess: async (data: BedCreateOutput) => {
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
  const onSubmit: SubmitHandler<BedCreateInput> = (data) => {
    mutate(data);
  };

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">Successfully created a bed!</Alert>
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

      <h2 className="text-xl font-semibold">Room</h2>
      <div className="flex flex-col items-stretch gap-2 sm:flex-row">
        <FormInput<BedCreateInput>
          label="label for the room"
          registerDetails={{...register("room", {
              required: "Room label is required",
            })}}
          id="room"
          errorMessage={errors.room ? errors.room.message : undefined}
        />
      </div>

      <h2 className="text-xl font-semibold">Building Address</h2>
      <FormInput<BedCreateInput>
        label="Street"
        registerDetails={{...register("street", {
            required: "Street is required"
          })}}
        id="street"
        errorMessage={errors.street ? errors.street.message : undefined}
      />

      <div className="flex flex-col items-stretch gap-2 sm:flex-row">
        <FormInput<BedCreateInput>
          label="City"
          registerDetails={{...register("city", {
              required: "City is required"
            })}}
          id="city"
          errorMessage={errors.city ? errors.city.message : undefined}
        />
        <FormInput<BedCreateInput>
          label="State"
          registerDetails={{...register("state", {
              required: "State is required"
            })}}
          id="state"
          errorMessage={errors.state ? errors.state.message : undefined}
        />
      </div>

      <div className="flex flex-col items-stretch gap-2 sm:flex-row">
        <FormGap />
        <FormInput<BedCreateInput>
          label="Zipcode"
          registerDetails={{...register("zipCode", {
              required: "Zipcode is required"
            })}}
          id="zipCode"
          errorMessage={errors.zipCode ? errors.zipCode.message : undefined}
        />
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

export default BedCreate;
