import type { User } from "@prisma/client";
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

type InvoiceCreateInput = RouterInputs["invoice"]["create"];
type InvoiceCreateOutput = RouterOutputs["invoice"]["create"];

interface InvoiceCreateProps {
  refetch: () => Promise<void>;
  popup: TablePopup<InvoiceRowData, InvoicePopupTypes>;
  setPopup: Dispatch<
    SetStateAction<TablePopup<InvoiceRowData, InvoicePopupTypes>>
  >;
}

/**
 * Invoice delete component.
 * @returns
 */
const InvoiceCreate = ({ refetch, setPopup }: InvoiceCreateProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    InvoiceCreateOutput | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvoiceCreateInput>();

  const { mutate } = api.invoice.create.useMutation({
    onSuccess: async (data: InvoiceCreateOutput) => {
      setServerResult(data);

      await refetch();
    },
    onError: (error) => setServerError(error.message),
  });

  /**
   * Form submit handler.
   */
  const onSubmit: SubmitHandler<InvoiceCreateInput> = (data) => {
    mutate(data);
  };

  /**
   * update state when dropdown changes
   */
  const changeDropDown = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };

  const [pats, updatePats] = React.useState<User[]>([]);

  const [patient, setValue] = React.useState("");

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      /**
       * Wait for available times to be fetched then display
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
      <Alert type="success">Successfully created a Invoice!</Alert>
      <button
        type="button"
        onClick={async () => {
          setPopup({ show: false });
          await getPatients();
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
            type="date"
            id="paymentDue"
            className="resize-none rounded border border-gray-300 p-2"
            {...register("paymentDue", {
              required: "Due date is required",
              // pattern: { //find out how to do this
              //   // make sure date is after today
              //   value: new Date(value).getTime() > new Date().getTime(),
              //   message: "Due date must be after today's date",
              // },
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

export default InvoiceCreate;