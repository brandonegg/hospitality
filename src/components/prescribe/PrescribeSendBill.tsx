import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { RouterInputs, RouterOutputs } from "../../lib/api";
import { api } from "../../lib/api";
import type { PrescribeRowData } from "../../pages/prescribe/index";
import Alert from "../Alert";
import type { TablePopup } from "../tables/input";

import type { PrescribePopupTypes } from "./PrescribePopup";

type PrescribeUpdateInput = RouterInputs["prescribe"]["send"];
type PrescribeUpdateOutput = RouterOutputs["prescribe"]["send"];

interface PrescribeSendBillProps {
  refetch: () => Promise<void>;
  prescribe?: PrescribeRowData;
  popup: TablePopup<PrescribeRowData, PrescribePopupTypes>;
  setPopup: Dispatch<
    SetStateAction<TablePopup<PrescribeRowData, PrescribePopupTypes>>
  >;
}

/**
 * Prescribe edit component.
 * @returns
 */
const PrescribeSendBill = ({
  refetch,
  prescribe,
  setPopup,
}: PrescribeSendBillProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    PrescribeUpdateOutput | undefined
  >(undefined);

  const { handleSubmit } = useForm<PrescribeUpdateInput>({
    defaultValues: {
      ...prescribe,
    },
  });

  const { mutate } = api.prescribe.send.useMutation({
    onSuccess: async (data: PrescribeUpdateOutput) => {
      setServerResult(data);

      await refetch();
    },
    onError: (error) => setServerError(error.message),
  });

  /**
   * Form submit handler.
   */
  const onSubmit: SubmitHandler<PrescribeUpdateInput> = (data) => {
    mutate(data);
  };

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

export default PrescribeSendBill;
