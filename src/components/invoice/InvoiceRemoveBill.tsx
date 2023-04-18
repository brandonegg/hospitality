import type { Rate } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import React, { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { InvoiceRowData } from "../../pages/invoice/index";
import type { RouterInputs, RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import Alert from "../Alert";
import ErrorMessage from "../ErrorMessage";
import type { TablePopup } from "../tables/input";

import type { InvoicePopupTypes } from "./InvoicePopup";

type InvoiceRemoveBillInput = RouterInputs["invoice"]["remove"];
type InvoiceRemoveBillOutput = RouterOutputs["invoice"]["remove"];

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
    InvoiceRemoveBillOutput | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvoiceRemoveBillInput>({
    defaultValues: {
      ...invoice,
      id: invoice?.id,
    },
  });

  const { mutate } = api.invoice.remove.useMutation({
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

  const [procs, updateProcs] = React.useState<Rate[]>([]);

  const [proc, setValue] = React.useState("");

  let namesStorage: Rate[] = [];
  if (invoice) {
    const { data: names } = api.invoice.getProcedures.useQuery({
      id: invoice.id,
    });
    namesStorage = names as Rate[];
  }

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      /**
       * Update to get procedures
       */
      function getProcedures() {
        updateProcs(namesStorage);
      }

      void getProcedures();
    }
    return () => {
      ignore = true;
    };
  }, [namesStorage]);

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
          <label htmlFor="rateId">Procedure</label>
          <select
            id="rateId"
            value={proc}
            className="rounded border border-gray-300 p-2"
            {...register("rateId", {
              required: "A procedure is required",
            })}
            onChange={changeDropDown}
          >
            {procs?.map((indvProc, index) => (
              <option key={index} value={indvProc.id}>
                {indvProc.name}
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
          Remove One
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
