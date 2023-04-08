import type { ChangeEventHandler, Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { BedRowData } from "../../pages/beds";
import type { RouterInputs, RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
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
const SelectPatientButton = ({patient, setPatientID, selectedPatientID}: {
  selectedPatientID: string | undefined,
  setPatientID: Dispatch<SetStateAction<string | undefined>>,
  patient: UserSearchOutput[number],
}) => {

  /**
   * Handle patient button on click event.
   */
  const handleClick = () => {
    setPatientID(patient.id);
  };

  if (selectedPatientID === patient.id) {
    return (
      <button>
        {patient.name}
      </button>
    );
  }

  return (
    <button onClick={handleClick}>
      {patient.name}
    </button>
  );
};

/**
 * Search results component shown below
 */
const SearchResults = ({results, setPatientID, selectedPatientID}: {
  selectedPatientID: string | undefined,
  results: UserSearchOutput | undefined,
  setPatientID: Dispatch<SetStateAction<string | undefined>>,
}) => {

  return (
    <div className="flex flex-col">
      {results?.map((item, id) => {
        return (
          <SelectPatientButton key={id} selectedPatientID={selectedPatientID} setPatientID={setPatientID} patient={item} />
        );
      })}
    </div>
  );
};

/**
 * Component for searching patients
 */
const UserSearch = ({setPatientID, patientID}: {
  setPatientID: Dispatch<SetStateAction<string | undefined>>,
  patientID: string | undefined,
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
      <SearchResults selectedPatientID={patientID} results={matchedPatients.data} setPatientID={setPatientID} />
    </div>
  );
};

/**
 * UserEdit component
 * @param param0
 * @returns JSX
 */
const BedAssign = ({ refetch, bed, setPopup }: BedAssignProps) => {
  const [patientID, setPatientID] = useState<string | undefined>(undefined);
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [serverResult, setServerResult] = useState<BedAssignOutput | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BedAssignInput>();

  const { mutate } = api.bed.update.useMutation({
    onSuccess: async (data: BedAssignOutput) => {
      setServerResult(data);

      await refetch();
    },
    onError: (error) => setServerError(error.message),
  });

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
          <UserSearch setPatientID={setPatientID} patientID={patientID} />
          <div className="hidden">
            <input
              type="text"
              id="patientId"
              className="rounded border border-gray-300 p-2"
              {...register("patientId", {
                required: "Please provide a patient to assign"
              })}
            />
            {errors.patientId?.message && (
              <ErrorMessage id={`$patient-id-error`}>
                {errors.patientId.message}
              </ErrorMessage>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-blue-600 py-2 px-3 font-semibold text-white hover:bg-blue-700"
        >
          Assign
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
