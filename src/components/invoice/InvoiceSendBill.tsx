import type { Invoice, User } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import React, { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { InvoiceRowData } from "../../pages/invoice/index";
import type { RouterInputs, RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import Alert from "../Alert";
import type { TablePopup } from "../tables/input";

import type { InvoicePopupTypes } from "./InvoicePopup";

const patients: User[] = [];
/**
 * instead of displaying all hours, grab the available times for the current doctor
 */
const getPatients = async function () {
  try {
    const body = {};
    await fetch(`/api/getPatients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((pats: User[]) => {
        patients.length = 0;
        pats.forEach((pat) => {
          patients.push(pat);
        });
      });
  } catch (error) {
    console.error(error);
  }
};
const patGetter = getPatients();

type InvoiceUpdateInput = RouterInputs["invoice"]["send"];
type InvoiceUpdateOutput = RouterOutputs["invoice"]["send"];

interface InvoiceSendBillProps {
  refetch: () => Promise<void>;
  invoice?: InvoiceRowData;
  popup: TablePopup<InvoiceRowData, InvoicePopupTypes>;
  setPopup: Dispatch<
    SetStateAction<TablePopup<InvoiceRowData, InvoicePopupTypes>>
  >;
}

/**
 * Invoice edit component.
 * @returns
 */
const InvoiceSendBill = ({
  refetch,
  invoice,
  setPopup,
}: InvoiceSendBillProps) => {
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
    },
  });

  const { mutate } = api.invoice.send.useMutation({
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

  const [pats, updatePats] = React.useState<User[]>([]);

  const [patient, setValue] = React.useState(invoice?.userId);

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      /**
       * Update to all patients
       */
      async function getPatients() {
        await patGetter;
        updatePats(patients);
      }
      void getPatients();
    }
    return () => {
      ignore = true;
    };
  });

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">
        Successfully sent (once that feature is added)!
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

      <div className="flex-1"></div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-blue-600 py-2 px-3 font-semibold text-white hover:bg-blue-700"
        >
          Send
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

export default InvoiceSendBill;