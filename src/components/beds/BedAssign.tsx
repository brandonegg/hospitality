import type { ChangeEventHandler, Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { RouterInputs, RouterOutputs } from "../../lib/api";
import { api } from "../../lib/api";
import type { BedRowData } from "../../pages/beds";
import Alert from "../Alert";
import ErrorMessage from "../ErrorMessage";
import type { TablePopup } from "../tables/input";

import type { BedPopupTypes } from "./BedPopup";

type BedAssignInput = RouterInputs["bed"]["assign"];
type BedAssignOutput = RouterOutputs["bed"]["assign"];
type UserSearchOutput = RouterOutputs["user"]["search"];

interface BedAssignProps {
  refetch: () => Promise<void>;
  bed?: BedRowData;
  popup: TablePopup<BedRowData, BedPopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<BedRowData, BedPopupTypes>>>;
}

/**
 * Single row of the patient results
 */
const SelectPatientButton = ({
  patient,
  setPatientID,
  selectedPatientID,
}: {
  selectedPatientID: string | undefined;
  setPatientID: Dispatch<SetStateAction<string | undefined>>;
  patient: UserSearchOutput[number];
}) => {
  /**
   * Handle patient button on click event.
   */
  const handleClick = () => {
    setPatientID(patient.id);
  };

  /**
   * Handle patient button on click event when it is selected
   */
  const unsetPatient = () => {
    setPatientID(undefined);
  };

  if (selectedPatientID === patient.id) {
    return (
      <button
        data-testid="assigned"
        onClick={unsetPatient}
        type="button"
        className="bg-gray-800 p-2 text-left text-white"
      >
        {patient.name}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="p-2 text-left hover:bg-gray-800 hover:text-white"
    >
      {patient.name}
    </button>
  );
};

/**
 * Search results component shown below
 */
const SearchResults = ({
  bed,
  results,
  setPatientID,
  selectedPatientID,
}: {
  bed?: BedRowData;
  selectedPatientID: string | undefined;
  results: UserSearchOutput | undefined;
  setPatientID: Dispatch<SetStateAction<string | undefined>>;
}) => {
  const filteredResults = results?.filter((value) => {
    return value.id !== bed?.occupant?.id;
  });

  return (
    <div className="mx-2 mt-2 flex flex-col divide-y-[1px] divide-neutral-300 overflow-hidden rounded-xl border border-neutral-500 bg-white">
      {bed?.occupant ? (
        <SelectPatientButton
          selectedPatientID={selectedPatientID}
          setPatientID={setPatientID}
          patient={{
            id: bed.occupant.id,
            name: bed.occupant.name,
            dateOfBirth: null,
          }}
        />
      ) : undefined}
      {filteredResults?.map((item, id) => {
        return (
          <SelectPatientButton
            key={id}
            selectedPatientID={selectedPatientID}
            setPatientID={setPatientID}
            patient={item}
          />
        );
      })}
    </div>
  );
};

/**
 * Component for searching patients
 */
const UserSearch = ({
  bed,
  setPatientID,
  patientID,
}: {
  bed?: BedRowData;
  setPatientID: Dispatch<SetStateAction<string | undefined>>;
  patientID: string | undefined;
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const matchedPatients = api.user.search.useQuery({
    count: 10,
    name: searchQuery,
  });

  /**
   * Handles the change event for search input field.
   * @returns
   */
  const searchUpdate: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex flex-1 flex-col">
      <label htmlFor="user-search">Search for patient</label>
      <input
        onChange={searchUpdate}
        type="text"
        id="user-search"
        placeholder="patient name"
        className="rounded border border-gray-300 p-2"
      />
      <SearchResults
        bed={bed}
        selectedPatientID={patientID}
        results={matchedPatients.data}
        setPatientID={setPatientID}
      />
    </div>
  );
};

/**
 * UserEdit component
 * @param param0
 * @returns JSX
 */
const BedAssign = ({ refetch, bed, setPopup }: BedAssignProps) => {
  const [patientID, setPatientID] = useState<string | undefined>(
    bed?.userId ?? undefined
  );
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<BedAssignOutput | undefined>(
    undefined
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BedAssignInput>();

  const { mutate } = api.bed.assign.useMutation({
    onSuccess: async (data: BedAssignOutput) => {
      setServerResult(data);

      await refetch();
    },
    onError: (error) => setServerError(error.message),
  });

  useEffect(() => {
    // update the patientID state with the watched patientId field
    setValue("bedId", bed?.id ?? "");
    setValue("patientId", patientID ?? "");
  }, [bed, patientID, setValue]);

  /**
   * Form submit handler.
   * @param data Form data.
   * @returns
   */
  const onSubmit: SubmitHandler<BedAssignInput> = (data) => {
    mutate(data);
  };

  return serverResult ? (
    <div className="space-y-2">
      <Alert type="success">Successfully assigned patient!</Alert>
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
      <h2 className="text-xl font-semibold">Assign Patient to {bed?.room}</h2>

      <div className="flex flex-col items-stretch gap-2 sm:flex-row">
        <div className="flex flex-grow flex-col">
          <UserSearch
            bed={bed}
            setPatientID={setPatientID}
            patientID={patientID}
          />
          {errors.patientId?.message && (
            <ErrorMessage id={`$patient-id-error`}>
              {errors.patientId.message}
            </ErrorMessage>
          )}

          <div className="hidden">
            {/** Hidden patientID field selected by search results */}
            <input
              type="text"
              id="patientId"
              className="rounded border border-gray-300 p-2"
              {...register("patientId", {})}
            />

            {/** Hidden bed ID field */}
            {bed?.id ? (
              <input
                type="text"
                id="bedId"
                value={bed.id ?? ""}
                className="rounded border border-gray-300 p-2"
                {...register("bedId", {
                  required: "Internal error occured, no bed ID provided.",
                  minLength: 1,
                })}
              />
            ) : undefined}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-blue-600 py-2 px-3 font-semibold text-white hover:bg-blue-700"
        >
          {bed?.userId && !patientID ? "Unassign" : "Assign"}
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

export default BedAssign;
