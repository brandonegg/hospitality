import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { InvoiceRowData } from "../../pages/invoice/index";
import type { RouterInputs, RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import Alert from "../Alert";
import ErrorMessage from "../ErrorMessage";
import type { TablePopup } from "../tables/input";

import type { InvoicePopupTypes } from "./InvoicePopup";

type InvoiceUpdateInput = RouterInputs["invoice"]["addItem"];
type InvoiceUpdateOutput = RouterOutputs["invoice"]["addItem"];

interface InvoiceAddBillProps {
  refetch: () => Promise<void>;
  invoice?: InvoiceRowData;
  popup: TablePopup<InvoiceRowData, InvoicePopupTypes>;
  setPopup: Dispatch<
    SetStateAction<TablePopup<InvoiceRowData, InvoicePopupTypes>>
  >;
}

/**
 * Invoice add to bill component.
 * @returns
 */
const InvoiceAddBill = ({
  refetch,
  invoice,
  setPopup,
}: InvoiceAddBillProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    InvoiceUpdateOutput | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvoiceUpdateInput>({
    defaultValues: {
      ...invoice,
      invoiceId: invoice?.id,
      quantity: 1,
    },
  });

  const { mutate } = api.invoice.addItem.useMutation({
    onSuccess: async (data: InvoiceUpdateOutput) => {
      setServerResult(data);

      await refetch();
    },
    onError: (error) => setServerError(error.message),
  });

  /**
   * Form submit handler.
   */
  const onSubmit: SubmitHandler<InvoiceUpdateInput> = (data) => {
    if (data.quantity) {
      // Fix for default behavior of input forms always passing value as string.
      data.quantity = parseInt(data.quantity as unknown as string);
    }
    mutate(data);
  };

  /**
   * update state when dropdown changes
   */
  const changeDropDown = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };

  const ratesQuery = api.rate.getAll.useQuery();

  const [rate, setValue] = useState("");

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">Successfully added to invoice bill!</Alert>
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
          <label htmlFor="rateId">Procedure</label>
          <select
            id="rateId"
            value={rate}
            className="rounded border border-gray-300 p-2"
            {...register("rateId", {
              required: "A procedure is required",
            })}
            onChange={changeDropDown}
          >
            {ratesQuery.data
              ? ratesQuery.data.map((rate, index) => (
                  <option key={index} value={rate.id}>
                    {rate.name}
                  </option>
                ))
              : undefined}
          </select>
          {errors.rateId && (
            <ErrorMessage id="rate-error">{errors.rateId.message}</ErrorMessage>
          )}
        </div>

        {/** Quantity input */}
        <div className="flex grow flex-col">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            className="rounded border border-gray-300 p-2"
            {...register("quantity", {
              required: "Quantity is required",
            })}
          />
          {errors.quantity && (
            <ErrorMessage id="username-error">
              {errors.quantity.message}
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

export default InvoiceAddBill;
