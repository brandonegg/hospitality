import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import React from "react";

type Props = {
  id: string;
  children: string | undefined;
};

/**
 * Error message react component.
 * @param id Error message id.
 * @param children Error message.
 * @returns JSX
 */
export default function ErrorMessage({ id, children }: Props) {
  return (
    <span
      id={id}
      className="inline-flex items-center gap-1 text-sm text-red-500"
    >
      <ExclamationTriangleIcon className="h-4 w-4" />
      {children}
    </span>
  );
}
