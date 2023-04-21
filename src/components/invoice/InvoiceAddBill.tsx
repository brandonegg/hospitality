import type { Rate } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { InvoiceRowData } from "../../pages/invoice/index";
import type { RouterInputs, RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import Alert from "../Alert";
import ErrorMessage from "../ErrorMessage";
import type { TablePopup } from "../tables/input";

import type { InvoicePopupTypes } from "./InvoicePopup";

const rates: Rate[] = [];
/**
 * instead of displaying all hours, grab the available times for the current doctor
 */
const getRates = async function () {
  try {
    const body = {};
    await fetch(`/api/getBillrates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((rats: Rate[]) => {
        rates.length = 0;
        rats.forEach((rat) => {
          rates.push(rat);
        });
      });
  } catch (error) {
    console.error(error);
  }
};
const rateGetter = getRates();

type InvoiceUpdateInput = RouterInputs["invoice"]["add"];
type InvoiceUpdateOutput = RouterOutputs["invoice"]["add"];

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
      id: invoice?.id,
    },
  });

  const { mutate } = api.invoice.add.useMutation({
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
    mutate(data);
  };

  /**
   * update state when dropdown changes
   */
  const changeDropDown = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };

  const [rats, updateRates] = useState<Rate[]>([]);

  const [rate, setValue] = useState("");

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      /**
       * Update to all patients
       */
      async function getRates() {
        await rateGetter;
        updateRates(rates);
      }
      void getRates();
    }
    return () => {
      ignore = true;
    };
  });

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

      <div className="flex-1">
        <div className="flex flex-grow flex-col">
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
            {rats.map((rate, index) => (
              <option key={index} value={rate.id}>
                {rate.name}
              </option>
            ))}
          </select>
          {errors.rateId && (
            <ErrorMessage id="rate-error">{errors.rateId.message}</ErrorMessage>
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
