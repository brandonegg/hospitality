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

type InvoiceRemoveBillInput = RouterInputs["invoice"]["removeItem"];
type InvoiceRemoveBillOutput = RouterOutputs["invoice"]["removeItem"];

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
const InvoiceRemoveBill = ({
  refetch,
  invoice,
  setPopup,
}: InvoiceAddBillProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    InvoiceRemoveBillOutput | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvoiceRemoveBillInput>({
    defaultValues: {
      ...invoice,
      invoiceId: invoice?.id,
    },
  });

  const { mutate } = api.invoice.removeItem.useMutation({
    onSuccess: async (data: InvoiceRemoveBillOutput) => {
      setServerResult(data);

      await refetch();
    },
    onError: (error) => setServerError(error.message),
  });

  /**
   * Form submit handler.
   */
  const onSubmit: SubmitHandler<InvoiceRemoveBillInput> = (data) => {
    mutate(data);
  };

  /**
   * update state when dropdown changes
   */
  const changeDropDown = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };

  const [procedure, setValue] = useState("");

  const { data: procedures } = api.invoice.getProcedures.useQuery({
    id: invoice?.id ?? "",
  });

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">Successfully removed from invoice bill!</Alert>
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
          <label htmlFor="rateId">Procedure - Name x quantity</label>
          <select
            id="lineItemId"
            value={procedure}
            className="rounded border border-gray-300 p-2"
            {...register("lineItemId", {
              required: "A procedure is required",
            })}
            onChange={changeDropDown}
          >
            {procedures?.map((lineItem, index) => (
              <option key={index} value={lineItem.id}>
                {lineItem.rate?.name} x {lineItem.quantity}
              </option>
            ))}
          </select>
          {errors.lineItemId && (
            <ErrorMessage id="rate-error">
              {errors.lineItemId.message}
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

export default InvoiceRemoveBill;
