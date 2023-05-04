import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import React from "react";

interface PageSelectorProps {
  page: number;
  limit: number;
  handleFetchNextPage: () => void;
  handleFetchPreviousPage: () => void;
  items: unknown[] | undefined;
}

/**
 * Page selector component.
 * @returns JSX
 */
export default function PageSelector({
  page,
  limit,
  handleFetchNextPage,
  handleFetchPreviousPage,
  items,
}: PageSelectorProps) {
  return (
    <div className="mx-auto mb-2 flex h-10 flex-row place-items-center justify-center space-x-4">
      <div className="flex">
        {page !== 0 ? (
          <button
            className="inline-flex w-28 cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 px-3 text-center text-sm text-white hover:bg-blue-700"
            onClick={handleFetchPreviousPage}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </button>
        ) : (
          <div className="w-28"></div>
        )}
      </div>
      <span className="flex justify-center font-semibold">Page {page + 1}</span>
      <div className="flex justify-end">
        {items?.length === limit ? (
          <button
            className="inline-flex w-28 cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 px-3 text-sm text-white hover:bg-blue-700"
            onClick={handleFetchNextPage}
          >
            Next <ChevronRightIcon className="h-4 w-4" />
          </button>
        ) : (
          <div className="w-28"></div>
        )}
      </div>
    </div>
  );
}
