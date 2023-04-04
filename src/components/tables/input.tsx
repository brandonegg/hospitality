import { Dialog } from "@headlessui/react";
import type { Dispatch, SetStateAction } from "react";

export type Popup<T> = {
    show: boolean;
    type?: "create" | "edit" | "delete";
    data?: T;
  };

/**
 * User popup title component.
 * @param type Popup type.
 * @returns JSX
 */
const TablePopupTitle = ({ type, label }: {
    type?: "create" | "edit" | "delete";
    label: string;
}) => {
    switch (type) {
        case "create":
        return <>Create {label}</>;
        case "edit":
        return <>Edit {label}</>;
        case "delete":
        return <>Delete {label}</>;
        default:
        return <></>;
    }
};

/**
 * Table popup for CRUD operations
 *
 * @param label Label of object table is representing
 * @returns JSX
 */
const TablePopup = ({ label, popup, setPopup }: {
    label: string,
    popup: Popup;
    setPopup: Dispatch<SetStateAction<Popup>>;
}) => {
    return (
        <Dialog
        open={popup.show}
        onClose={() => setPopup({ show: false })}
        className="relative z-50"
        id="dialog"
        >
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            {/* Full-screen container to center the panel */}
            <div className="fixed inset-0 flex items-center justify-center p-4 ">
                <Dialog.Panel className="mx-auto w-full max-w-2xl space-y-2 rounded-xl border border-gray-600 bg-slate-100 p-4 drop-shadow-lg">
                <Dialog.Title className="text-3xl font-bold">
                    <TablePopupTitle label={label} type={popup.type} />
                </Dialog.Title>

                {/* Place table body here */}

                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export {
    TablePopup,
};
