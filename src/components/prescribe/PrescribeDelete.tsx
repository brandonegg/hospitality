import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { RouterInputs, RouterOutputs } from "../../lib/api";
import { api } from "../../lib/api";
import type { PrescribeRowData } from "../../pages/prescribe/index";
import Alert from "../Alert";
import type { TablePopup } from "../tables/input";

import type { PrescribePopupTypes } from "./PrescribePopup";

interface PrescribeDeleteProps {
  refetch: () => Promise<void>;
  prescribe?: PrescribeRowData;
  popup: TablePopup<PrescribeRowData, PrescribePopupTypes>;
  setPopup: Dispatch<
    SetStateAction<TablePopup<PrescribeRowData, PrescribePopupTypes>>
  >;
}

type PrescribeDeleteInput = RouterInputs["prescribe"]["delete"];
type PrescribeDeleteOutput = RouterOutputs["prescribe"]["delete"];

/**
 * Prescribe delete component.
 * @returns
 */
const PrescribeDelete = ({
  refetch,
  prescribe,
  setPopup,
}: PrescribeDeleteProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    PrescribeDeleteOutput | undefined
  >(undefined);
  const [name, setName] = useState<string | undefined>(undefined);

  const leName = getName(prescribe?.userId ?? "");

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

  const { register, handleSubmit } = useForm<PrescribeDeleteInput>();

  const { mutate } = api.prescribe.delete.useMutation({
    onSuccess: async (data: PrescribeDeleteOutput) => {
      setServerResult(data);

      await refetch();
    },
    onError: (error) => setServerError(error.message),
  });

  /**
   * Form submit handler.
   */
  const onSubmit: SubmitHandler<PrescribeDeleteInput> = (data) => {
    mutate(data);
  };

  /**
   * Get the user name based off an id
   * @param id
   * @returns
   */
  function getName(id: string | undefined): string | undefined {
    if (id) {
      const { data: name } = api.prescribe.getName.useQuery({ id: id });
      return name?.name;
    } else {
      // to make react happy
      const { data: name } = api.prescribe.getName.useQuery({ id: "" });
      return name?.name;
    }
  }

  if (!prescribe) {
    return <></>;
  }

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">Successfully deleted Prescribe!</Alert>
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

      <p>Do you want to delete this Prescribe?</p>

      <div className="space-y-1">
        <div className="grid grid-cols-10">
          <p className="col-span-10 font-semibold sm:col-span-2">User:</p>
          <p className="col-span-10 sm:col-span-8">
            {name ? name : "User not found"}
          </p>
        </div>
      </div>

      <input type="hidden" value={prescribe?.id} {...register("id")} />

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

export default PrescribeDelete;
