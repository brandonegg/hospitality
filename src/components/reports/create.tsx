import type { VisitReport } from "@prisma/client";
import type { Session } from "next-auth";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { RouterInputs, RouterOutputs } from "../../lib/api";
import { api } from "../../lib/api";
import Alert from "../Alert";
import ErrorMessage from "../ErrorMessage";
import type { UserSearchOutput } from "../forms/input";
import { FormGap } from "../forms/input";
import { FormInput } from "../forms/input";
import { SectionLabel } from "../forms/input";
import { FormTextField } from "../forms/input";
import { UserSearch } from "../forms/input";

export type VisitReportCreateInput = RouterInputs["visitReport"]["create"];
export type VisitReportCreateOutput = RouterOutputs["visitReport"]["create"];

/**
 * Main create report form body.
 * @returns
 */
const FormBody = ({
  doctor,
  setServerResult,
  selectedPatient,
  setPatient,
}: {
  doctor: Session["user"];
  setServerResult: Dispatch<SetStateAction<VisitReport | undefined>>;
  selectedPatient: UserSearchOutput[number] | undefined;
  setPatient: Dispatch<SetStateAction<UserSearchOutput[number] | undefined>>;
}) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    setValue,
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

  useEffect(() => {
    // update the patientID state with the watched patientId field
    setValue("patientId", selectedPatient?.id ?? "");
    setValue("doctorId", doctor.id);
  }, [selectedPatient, doctor, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="overflow-hidden rounded-xl border border-gray-600 bg-slate-100 pb-4 drop-shadow"
    >
      <div className="border-b border-neutral-400 bg-black py-2 px-4">
        <h1 className="text-lg font-semibold text-neutral-300">Report</h1>
      </div>
      <div className="space-y-12 p-4">
        <div className="flex flex-row space-x-8">
          {/** Patient selector */}
          <div className="grow">
            <SectionLabel>Lookup Patient</SectionLabel>
            {errors.patientId?.message && (
              <ErrorMessage id={`patient-id-error`}>
                {errors.patientId.message}
              </ErrorMessage>
            )}
            <UserSearch
              selectedPatient={selectedPatient}
              setPatient={setPatient}
            />

            <div className="hidden">
              {/** Hidden patientID and doctorID field selected by search results */}
              <input
                type="text"
                id="patient-id"
                {...register("patientId", {
                  required: "A patient is required to assign the report to.",
                })}
              />

              <input
                type="text"
                id="doctor-id"
                {...register("doctorId", {
                  required: "A doctor is required to assign the report to.",
                })}
              />
            </div>
          </div>

          {/** Vitals form */}
          <div className="grow space-y-4">
            <SectionLabel>Vitals</SectionLabel>

            <div className="flex flex-row space-x-2">
              <FormInput
                registerDetails={{
                  ...register("vitals.pulse", {
                    required: "Pulse is required",
                    valueAsNumber: true,
                  }),
                }}
                type="number"
                label="Pulse"
                id="pulse"
                unit="bpm"
                errorMessage={
                  errors.vitals?.pulse?.message
                    ? errors.vitals.pulse.message
                    : undefined
                }
              />
              <FormInput
                registerDetails={{
                  ...register("vitals.temperature", {
                    required: "Temperature is required",
                    valueAsNumber: true,
                  }),
                }}
                type="number"
                label="Temperature"
                id="temperature"
                unit="F"
                errorMessage={
                  errors.vitals?.temperature?.message
                    ? errors.vitals.temperature.message
                    : undefined
                }
              />
            </div>

            <div className="flex flex-row space-x-2">
              <FormInput
                registerDetails={{
                  ...register("vitals.weight", {
                    required: "Weight is required",
                    valueAsNumber: true,
                  }),
                }}
                type="number"
                label="Weight"
                id="weight"
                unit="lbs"
                errorMessage={
                  errors.vitals?.weight?.message
                    ? errors.vitals.weight.message
                    : undefined
                }
              />
              <FormInput
                registerDetails={{
                  ...register("vitals.respiration", {
                    required: "Respiration is required",
                    valueAsNumber: true,
                  }),
                }}
                type="number"
                label="Respiration"
                id="respiration"
                errorMessage={
                  errors.vitals?.respiration?.message
                    ? errors.vitals.respiration.message
                    : undefined
                }
              />
            </div>

            <div className="flex flex-row space-x-2">
              <FormInput
                registerDetails={{
                  ...register("vitals.oxygenSaturation", {
                    required: "Oxygen saturation is required",
                    valueAsNumber: true,
                  }),
                }}
                type="number"
                label="Oxygen Saturation"
                id="oxygen-saturation"
                unit="%"
                errorMessage={
                  errors.vitals?.oxygenSaturation?.message
                    ? errors.vitals.oxygenSaturation.message
                    : undefined
                }
              />
              <FormGap />
            </div>
          </div>
        </div>

        {/** SOAP note form section */}
        <div className="space-y-4">
          <SectionLabel>SOAP Notes</SectionLabel>
          <FormTextField<VisitReportCreateInput>
            registerDetails={{
              ...register("soapNotes.subjective", {
                required: "Report requires a subjective",
              }),
            }}
            label="Subjective"
            id="subjective"
            errorMessage={
              errors.soapNotes?.subjective?.message
                ? errors.soapNotes.subjective.message
                : undefined
            }
          />

          <FormTextField<VisitReportCreateInput>
            registerDetails={{
              ...register("soapNotes.objective", {
                required: "Report requires an objective",
              }),
            }}
            label="Objective"
            id="objective"
            errorMessage={
              errors.soapNotes?.objective?.message
                ? errors.soapNotes.objective.message
                : undefined
            }
          />

          <FormTextField<VisitReportCreateInput>
            registerDetails={{
              ...register("soapNotes.assessment", {
                required: "Report requires an assessment",
              }),
            }}
            label="Assessment"
            id="assessment"
            errorMessage={
              errors.soapNotes?.assessment?.message
                ? errors.soapNotes.assessment.message
                : undefined
            }
          />

          <FormTextField<VisitReportCreateInput>
            registerDetails={{
              ...register("soapNotes.plan", {
                required: "Report requires a plan",
              }),
            }}
            label="Plan"
            id="plan"
            errorMessage={
              errors.soapNotes?.plan?.message
                ? errors.soapNotes.plan.message
                : undefined
            }
          />
        </div>

        <div className="mx-auto w-fit space-y-4">
          {/* server response error */}
          {serverError && <Alert type="error">{serverError}</Alert>}
          <button
            type="submit"
            className="mx-auto block w-32 rounded-lg border bg-blue-600 px-4 py-2 text-lg font-semibold text-white hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

/**
 * Main create report form for doctors to fill out.
 */
const CreateReportForm = ({ doctor }: { doctor: Session["user"] }) => {
  const [selectedPatient, setPatient] = useState<
    UserSearchOutput[number] | undefined
  >(undefined);
  const [serverResult, setServerResult] = useState<
    VisitReportCreateOutput | undefined
  >(undefined);

  /**
   * Inner body element
   */
  const SuccessBody = () => {
    return (
      <div className="space-y-8 overflow-hidden rounded-xl border border-gray-600 bg-slate-100 py-16 px-4 text-center drop-shadow">
        <h1 className="text-4xl font-bold text-green-500">Success!</h1>
        <p>
          The post visit report has been submitted successfully for{" "}
          {selectedPatient?.name ?? "ERROR"}
        </p>
      </div>
    );
  };

  return (
    <div className="mb-4 space-y-12">
      <div className="space-y-4 rounded-xl border border-neutral-400 bg-neutral-300 p-4 drop-shadow">
        <h1 className="text-3xl font-bold">Create Report</h1>
        <p>
          Complete the form below and then press create. The patient will have
          this report displayed in their dashboard reports tab.
        </p>
      </div>

      {serverResult ? (
        <SuccessBody />
      ) : (
        <FormBody
          doctor={doctor}
          selectedPatient={selectedPatient}
          setPatient={setPatient}
          setServerResult={setServerResult}
        />
      )}
    </div>
  );
};

export { CreateReportForm };
