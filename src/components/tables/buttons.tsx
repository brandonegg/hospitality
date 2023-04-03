import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import type { MouseEventHandler } from "react";

export interface ButtonDetails {
    onClick: MouseEventHandler<HTMLButtonElement> | undefined;
    testId: string;
}

/**
 * Adds a '+ Add {item}' button to table view.
 */
const AddButton = ({ onClick, label }: ButtonDetails &
    {
        label: string,
    }) => {
        return (
            <button
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 py-2 px-3 font-semibold text-white hover:bg-blue-700"
                onClick={onClick}
                >
                <PlusIcon className="h-4 w-4" />
                Add {label}
            </button>
        );
    };

/**
 * Button for editing the row of a table.
 */
const EditRowButton = ({ onClick, testId }: ButtonDetails) => {
    return (
        <button
            data-testid={testId}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 py-2 px-3 font-semibold text-white hover:bg-blue-700"
            onClick={onClick}
        >
            <PencilSquareIcon className="h-4 w-4" />
            Edit
        </button>
    );
};

/**
 * Delete row button for table.
 */
const DeleteRowButton = ({ onClick, testId } : ButtonDetails) => {
    return (
        <button
            data-testid={testId}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 py-2 px-3 font-semibold text-white hover:bg-red-700"
            onClick={onClick}
        >
            <TrashIcon className="h-4 w-4" />
            Delete
        </button>
    );
};

export {
    AddButton,
    EditRowButton,
    DeleteRowButton,
};
