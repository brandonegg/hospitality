import type { FieldErrors, FieldValues, Path, UseFormRegisterReturn } from "react-hook-form";

import ErrorMessage from "../ErrorMessage";

interface FormInputProps<T extends FieldValues> {
    label?: string;
    id: string;
    registerDetails: UseFormRegisterReturn<Path<T>>;
    errorMessage: string | undefined;
}

/**
 * Use this to create an equally spaced gap for the input row
 * if you don't want a FormInput to span the full width.
 */
const FormGap = () => {
  return (
    <div className="flex-1 flex flex-grow flex-col">
    </div>
  );
};

/**
 * Basic error handling form input
 */
const FormInput = <T extends FieldValues,>({label, id, errorMessage, registerDetails}: FormInputProps<T>) => {
    return (
        <div className="flex flex-1 flex-col">
          { label && (
            <label htmlFor={id}>{label}</label>
          )}
          <input
            type="text"
            id={id}
            className="rounded border border-gray-300 p-2"
            {...registerDetails}
          />
          {errorMessage && (
            <ErrorMessage id={`${id}-error`}>
              {errorMessage}
            </ErrorMessage>
          )}
        </div>
    );
};

export {
    FormInput,
    FormGap,
};
