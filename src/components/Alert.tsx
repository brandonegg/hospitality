import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import React from "react";

import { classNames } from "../utils/text";

type Props = {
  type: string;
  children: string | undefined;
};

/**
 * Alert react component.
 * @param type Alert type.
 * @param children Alert message.
 * @returns JSX
 */
export default function Alert({ type, children }: Props) {
  return (
    <div
      id={`alert-${type}`}
      className={classNames(
        "flex items-center gap-1 rounded border px-4 py-3",
        type === "success"
          ? "border-green-400 bg-green-100 text-green-700"
          : "border-red-400 bg-red-100 text-red-700"
      )}
      role="alert"
    >
      {type === "success" ? (
        <CheckCircleIcon className="h-5 w-5" />
      ) : (
        <ExclamationCircleIcon className="h-5 w-5" />
      )}
      <span className="block sm:inline" id={`alert-${type}-message`}>
        {children}
      </span>
    </div>
  );
}
