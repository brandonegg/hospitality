import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import type { Test, User } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { RouterInputs, RouterOutputs } from "../../lib/api";
import { api } from "../../lib/api";
import type { TestRowData } from "../../pages/lab-tests";
import Alert from "../Alert";
import type { TablePopup } from "../tables/input";

import type { TestPopupTypes } from "./LabTestPopup";

interface TestDeleteProps {
  refetch: () => Promise<void>;
  test?: TestRowData;
  popup: TablePopup<TestRowData, TestPopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<TestRowData, TestPopupTypes>>>;
}

type TestDeleteInput = RouterInputs["labTest"]["delete"];
type TestDeleteOutput = RouterOutputs["labTest"]["delete"];

/**
 * Test delete component.
 * @returns
 */
const TestDelete = ({ refetch, test, setPopup }: TestDeleteProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    TestDeleteOutput | undefined
  >(undefined);

  const { register, handleSubmit } = useForm<TestDeleteInput>();

  const { mutate } = api.labTest.delete.useMutation({
    onSuccess: async (data: TestDeleteOutput) => {
      setServerResult(data);

      await refetch();
    },
    onError: (error) => setServerError(error.message),
  });

  /**
   * Form submit handler.
   */
  const onSubmit: SubmitHandler<TestDeleteInput> = (data) => {
    mutate(data);
  };

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">Successfully deleted test!</Alert>
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

      <p>Do you want to delete this test?</p>

      <div className="space-y-1">
        <div className="grid grid-cols-10">
          <p className="col-span-10 font-semibold sm:col-span-2">User:</p>
          <p className="col-span-10 sm:col-span-8">
            {(test?.user as User).name ?? ""}
          </p>
        </div>

        <div className="grid grid-cols-10">
          <p className="col-span-10 font-semibold sm:col-span-2">Test:</p>
          <p className="col-span-10 sm:col-span-8">
            {(test?.test as Test).name ?? ""}
          </p>
        </div>

        <div className="grid grid-cols-10">
          <p className="col-span-10 font-semibold sm:col-span-2">Result:</p>
          <p className="col-span-10 sm:col-span-8">{test?.result}</p>
        </div>
      </div>

      <input type="hidden" value={test?.id} {...register("id")} />

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

export default TestDelete;
