import type {
  ChangeEventHandler,
  Dispatch,
  InputHTMLAttributes,
  SetStateAction,
} from "react";
import { useState } from "react";
import type { FieldValues, Path, UseFormRegisterReturn } from "react-hook-form";

import type { RouterOutputs } from "../../lib/api";
import { api } from "../../lib/api";
import ErrorMessage from "../ErrorMessage";

export type UserSearchOutput = RouterOutputs["user"]["search"];

export interface FormInputProps<T extends FieldValues> {
  label?: string;
  id: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  registerDetails: UseFormRegisterReturn<Path<T>>;
  errorMessage: string | undefined;
  unit?: string;
}

/**
 * Use this to create an equally spaced gap for the input row
 * if you don't want a FormInput to span the full width.
 */
const FormGap = () => {
  return <div className="w-full grow"></div>;
};

/**
 * Basic error handling form input
 */
const FormInput = <T extends FieldValues>({
  label,
  id,
  type = "text",
  errorMessage,
  registerDetails,
  unit,
}: FormInputProps<T>) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id}>{label}</label>}
      <div className="flex flex-row overflow-hidden rounded border border-gray-300">
        <input type={type} id={id} className="grow p-2" {...registerDetails} />
        {unit ? (
          <span className="w-12 shrink border-l bg-gray-300 p-2 text-center text-gray-600">
            {unit}
          </span>
        ) : undefined}
      </div>
      {errorMessage && (
        <ErrorMessage id={`${id}-error`}>{errorMessage}</ErrorMessage>
      )}
    </div>
  );
};

/**
 * General section of form label
 */
const SectionLabel = ({ children }: { children: JSX.Element | string }) => {
  return (
    <h2 className="mb-4 text-xl font-semibold text-neutral-600">{children}</h2>
  );
};

/**
 * Basic error handling form input
 */
const FormTextField = <T extends FieldValues>({
  label,
  id,
  errorMessage,
  registerDetails,
}: FormInputProps<T>) => {
  return (
    <div className="flex flex-1 flex-col">
      {label && <label htmlFor={id}>{label}</label>}
      {errorMessage && (
        <ErrorMessage id={`${id}-error`}>{errorMessage}</ErrorMessage>
      )}
      <textarea
        id={id}
        className="flex h-32 rounded border border-gray-300 p-2 text-start"
        {...registerDetails}
      />
    </div>
  );
};

/**
 * Single row of the patient results
 */
const SelectPatientButton = ({
  selectedPatient,
  setPatient,
  patient,
}: {
  selectedPatient: UserSearchOutput[number] | undefined;
  setPatient: Dispatch<SetStateAction<UserSearchOutput[number] | undefined>>;
  patient: UserSearchOutput[number];
}) => {
  /**
   * Handle patient button on click event.
   */
  const handleClick = () => {
    setPatient(patient);
  };

  /**
   * Handle patient button on click event when it is selected
   */
  const unsetPatient = () => {
    setPatient(undefined);
  };

  if (selectedPatient?.id === patient.id) {
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
  results,
  selectedPatient,
  setPatient,
}: {
  selectedPatient: UserSearchOutput[number] | undefined;
  results: UserSearchOutput | undefined;
  setPatient: Dispatch<SetStateAction<UserSearchOutput[number] | undefined>>;
}) => {
  const filteredResults = results?.filter((value) => {
    return value.id !== selectedPatient?.id;
  });

  return (
    <div className="mx-2 mt-2 flex flex-col divide-y-[1px] divide-neutral-300 overflow-hidden rounded-xl border border-neutral-500 bg-white">
      {selectedPatient ? (
        <SelectPatientButton
          selectedPatient={selectedPatient}
          setPatient={setPatient}
          patient={selectedPatient}
        />
      ) : undefined}
      {filteredResults?.map((item, id) => {
        return (
          <SelectPatientButton
            key={id}
            selectedPatient={selectedPatient}
            setPatient={setPatient}
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
  setPatient,
  selectedPatient,
}: {
  setPatient: Dispatch<SetStateAction<UserSearchOutput[number] | undefined>>;
  selectedPatient: UserSearchOutput[number] | undefined;
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
        selectedPatient={selectedPatient}
        results={matchedPatients.data}
        setPatient={setPatient}
      />
    </div>
  );
};

// TODO: Add form text field for SOAP notes

export { FormInput, FormGap, UserSearch, FormTextField, SectionLabel };
