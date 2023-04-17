import type { Invoice, User } from "@prisma/client";
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

type InvoiceUpdateInput = RouterInputs["invoice"]["update"];
type InvoiceUpdateOutput = RouterOutputs["invoice"]["update"];

interface InvoiceEditProps {
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
const InvoiceEdit = ({ refetch, invoice, setPopup }: InvoiceEditProps) => {
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
      paymentDue: new Date(
        (invoice as Invoice).paymentDue.getTime() -
          (invoice as Invoice).paymentDue.getTimezoneOffset() * -60000
      )
        .toISOString()
        .slice(0, 10),
    },
  });

  const { mutate } = api.invoice.update.useMutation({
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
      <Alert type="success">Successfully updated an invoice!</Alert>
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
            {pats.map((user, index) => (
              <option key={index} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.userId && (
            <ErrorMessage id="user-error">{errors.userId.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-grow flex-col">
          <label htmlFor="paymentDue">Due Date</label>
          <input
            type="Date"
            id="paymentDue"
            value={new Date(
              (invoice as Invoice).paymentDue.getTime() -
                (invoice as Invoice).paymentDue.getTimezoneOffset() * -60000
            )
              .toISOString()
              .slice(0, 10)}
            className="rounded border border-gray-300 p-2"
            {...register("paymentDue", {
              required: "payment due date is required",
            })}
          />
          {errors.paymentDue && (
            <ErrorMessage id="paymentDue-error">
              {errors.paymentDue.message}
            </ErrorMessage>
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

export default InvoiceEdit;
