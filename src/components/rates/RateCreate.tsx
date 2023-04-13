import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { RateRowData } from "../../pages/rates";
import type { RouterInputs, RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import Alert from "../Alert";
import ErrorMessage from "../ErrorMessage";
import type { TablePopup } from "../tables/input";

import type { RatePopupTypes } from "./RatePopup";

type RateCreateInput = RouterInputs["rate"]["create"];
type RateCreateOutput = RouterOutputs["rate"]["create"];

interface RateCreateProps {
  refetch: () => Promise<void>;
  popup: TablePopup<RateRowData, RatePopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<RateRowData, RatePopupTypes>>>;
}

/**
 * Rate delete component.
 * @returns
 */
const RateCreate = ({ refetch, setPopup }: RateCreateProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    RateCreateOutput | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RateCreateInput>();

  const { mutate } = api.rate.create.useMutation({
    onSuccess: async (data: RateCreateOutput) => {
      setServerResult(data);

      await refetch();
    },
    onError: (error) => setServerError(error.message),
  });

  /**
   * Form submit handler.
   */
  const onSubmit: SubmitHandler<RateCreateInput> = (data) => {
    mutate(data);
  };

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">Successfully created a rate!</Alert>
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
          <label htmlFor="description">Description</label>
          <textarea
            rows={4}
            id="description"
            className="resize-none rounded border border-gray-300 p-2"
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <ErrorMessage id="description-error">
              {errors.description.message}
            </ErrorMessage>
          )}
        </div>

        <div className="flex flex-grow flex-col">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            step="0.01"
            className="rounded border border-gray-300 p-2"
            {...register("price", {
              required: "Price is required",
            })}
          />
          {errors.price && (
            <ErrorMessage id="price-error">{errors.price.message}</ErrorMessage>
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

export default RateCreate;
