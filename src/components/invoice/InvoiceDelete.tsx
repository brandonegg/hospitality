import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { InvoiceRowData } from "../../pages/invoice/index";
import type { RouterInputs, RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import Alert from "../Alert";
import type { TablePopup } from "../tables/input";

import type { InvoicePopupTypes } from "./InvoicePopup";

interface InvoiceDeleteProps {
  refetch: () => Promise<void>;
  invoice?: InvoiceRowData;
  popup: TablePopup<InvoiceRowData, InvoicePopupTypes>;
  setPopup: Dispatch<
    SetStateAction<TablePopup<InvoiceRowData, InvoicePopupTypes>>
  >;
}

type InvoiceDeleteInput = RouterInputs["invoice"]["delete"];
type InvoiceDeleteOutput = RouterOutputs["invoice"]["delete"];

/**
 * Invoice delete component.
 * @returns
 */
const InvoiceDelete = ({ refetch, invoice, setPopup }: InvoiceDeleteProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    InvoiceDeleteOutput | undefined
  >(undefined);
  const [name, setName] = useState<string | undefined>(undefined);

  const leName = getName(invoice?.userId);

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      /**
       * Update to all patients
       */
      function getTheName() {
        setName(leName);
      }
      void getTheName();
    }
    return () => {
      ignore = true;
    };
  }, [leName]);

  const { register, handleSubmit } = useForm<InvoiceDeleteInput>();

  const { mutate } = api.invoice.delete.useMutation({
    onSuccess: async (data: InvoiceDeleteOutput) => {
      setServerResult(data);

      await refetch();
    },
    onError: (error) => setServerError(error.message),
  });

  /**
   * Form submit handler.
   */
  const onSubmit: SubmitHandler<InvoiceDeleteInput> = (data) => {
    mutate(data);
  };

  /**
   * Get the user name based off an id
   * @param id
   * @returns
   */
  function getName(id: string | undefined): string | undefined {
    if (id) {
      const { data: name } = api.invoice.getName.useQuery({ id: id });
      return name?.name;
    } else {
      // to make react happy
      const { data: name } = api.invoice.getName.useQuery({ id: "" });
      return name?.name;
    }
  }

  if (!invoice) {
    return <></>;
  }

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">Successfully deleted Invoice!</Alert>
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

      <p>Do you want to delete this Invoice?</p>

      <div className="space-y-1">
        <div className="grid grid-cols-10">
          <p className="col-span-10 font-semibold sm:col-span-2">User:</p>
          <p className="col-span-10 sm:col-span-8">
            {name ? name : "User not found"}
          </p>
        </div>

        <div className="grid grid-cols-10">
          <p className="col-span-10 font-semibold sm:col-span-2">Due Date:</p>
          <p className="col-span-10 sm:col-span-8">
            {new Date(
              invoice.paymentDue.getTime() -
                invoice.paymentDue.getTimezoneOffset() * -60000
            )
              .toISOString()
              .slice(0, 10)}
          </p>
        </div>
      </div>

      <input type="hidden" value={invoice?.id} {...register("id")} />

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

export default InvoiceDelete;
