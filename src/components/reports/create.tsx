import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { RouterInputs, RouterOutputs } from "../../lib/api";
import { api } from "../../lib/api";
import ErrorMessage from "../ErrorMessage";
import type { UserSearchOutput } from "../forms/input";
import { UserSearch } from "../forms/input";

export type VisitReportCreateInput = RouterInputs["visitReport"]["create"];
export type VisitReportCreateOutput = RouterOutputs["visitReport"]["create"];

/**
 * Main create report form for doctors to fill out.
 */
const CreateReportForm = () => {
  const [selectedPatient, setPatient] = useState<
    UserSearchOutput[number] | undefined
  >(undefined);
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<
    VisitReportCreateOutput | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VisitReportCreateInput>();

  const { mutate } = api.visitReport.create.useMutation({
    onSuccess: (data: VisitReportCreateOutput) => {
      setServerResult(data);
    },
    onError: (error) => setServerError(error.message),
  });

  /**
   * Form submit handler.
   * @param data Form data.
   * @returns
   */
  const onSubmit: SubmitHandler<VisitReportCreateInput> = (data) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-3xl font-bold">Create Report</h1>
      <h2>Select Patient:</h2>
      {/** Insert patient dropdown selector */}
      <UserSearch selectedPatient={selectedPatient} setPatient={setPatient} />
      {errors.patientId?.message && (
        <ErrorMessage id={`$patient-id-error`}>
          {errors.patientId.message}
        </ErrorMessage>
      )}

      <h2>SOAP Notes:</h2>
      {/** SOAP note form section */}

      <h2>Patient Vitals:</h2>
      {/** Vitals input form */}
    </form>
  );
};

export { CreateReportForm };
