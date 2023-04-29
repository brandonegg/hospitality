import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { RouterInputs, RouterOutputs } from "../../lib/api";
import { api } from "../../lib/api";
import type { TestRowData } from "../../pages/lab-tests";
import Alert from "../Alert";
import ErrorMessage from "../ErrorMessage";
import type { TablePopup } from "../tables/input";

import type { TestPopupTypes } from "./LabTestPopup";

type TestUpdateInput = RouterInputs["labTest"]["update"];
type TestUpdateOutput = RouterOutputs["labTest"]["update"];

interface TestEditProps {
  refetch: () => Promise<void>;
  test?: TestRowData;
  popup: TablePopup<TestRowData, TestPopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<TestRowData, TestPopupTypes>>>;
}

/**
 * Test edit component.
 * @returns
 */
const TestEdit = ({ refetch, test, setPopup }: TestEditProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    TestUpdateOutput | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestUpdateInput>({
    defaultValues: {
      ...test,
      userId: test?.userId as string | undefined,
      testId: test?.testId as string | undefined,
      result: test?.result as string | undefined,
    },
  });

  const { mutate } = api.labTest.update.useMutation({
    onSuccess: async (data: TestUpdateOutput) => {
      setServerResult(data);

      await refetch();
    },
    onError: (error) => setServerError(error.message),
  });

  const patientsQuery = api.user.getAllPatients.useQuery();
  const testsQuery = api.test.getAll.useQuery();

  /**
   * Form submit handler.
   */
  const onSubmit: SubmitHandler<TestUpdateInput> = (data) => {
    mutate(data);
  };

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">Successfully updated a test!</Alert>
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
            className="rounded border border-gray-300 p-2"
            {...register("userId", {
              required: "User is required",
            })}
          >
            {patientsQuery.data
              ? patientsQuery.data.map((user, index) => (
                  <option key={index} value={user.id}>
                    {user.name}
                  </option>
                ))
              : undefined}
          </select>
          {errors.userId && (
            <ErrorMessage id="user-error">{errors.userId.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-grow flex-col">
          <label htmlFor="testId">Test</label>
          <select
            id="testId"
            className="rounded border border-gray-300 p-2"
            {...register("testId", {
              required: "Test is required",
            })}
          >
            {testsQuery.data
              ? testsQuery.data.map((test, index) => (
                  <option key={index} value={test.id}>
                    {test.name}
                  </option>
                ))
              : undefined}
          </select>
          {errors.testId && (
            <ErrorMessage id="user-error">{errors.testId.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-grow flex-col">
          <label htmlFor="result">Result</label>
          <textarea
            rows={4}
            id="result"
            className="resize-none rounded border border-gray-300 p-2"
            {...register("result", {
              required: "Result is required",
            })}
          />
          {errors.result && (
            <ErrorMessage id="result-error">
              {errors.result.message}
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

export default TestEdit;
