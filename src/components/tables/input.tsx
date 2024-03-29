import { Dialog } from "@headlessui/react";
import type { Dispatch, SetStateAction } from "react";

export type TablePopup<T, V> = {
  show: boolean;
  type?: V;
  data?: T;
};

interface TablePopupTitleProps<V> {
  type?: V;
  label: string;
}

/**
 * User popup title component.
 * @param type Popup type.
 * @returns JSX
 */
const TablePopupTitle = <V,>({ type, label }: TablePopupTitleProps<V>) => {
  switch (type) {
    case "create":
      return <>Create {label}</>;
    case "edit":
      return <>Edit {label}</>;
    case "delete":
      return <>Delete {label}</>;
    case "sendBill":
      return <>Send {label}</>;
    case "addBill":
      return <>Add to {label}</>;
    case "removeBill":
      return <>Remove from {label}</>;
    default:
      return <></>;
  }
};

interface TablePopupProps<T, V> {
  label: string;
  popup: TablePopup<T, V>;
  refetch: () => Promise<void>;
  setPopup: Dispatch<SetStateAction<TablePopup<T, V>>>;
  children: JSX.Element;
}

/**
 * Table popup for CRUD operations
 *
 * @param label Label of object table is representing
 * @returns JSX
 */
const TablePopup = <T, V>({
  label,
  popup,
  setPopup,
  children,
}: TablePopupProps<T, V>) => {
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
            <TablePopupTitle<V> label={label} type={popup.type} />
          </Dialog.Title>

          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export { TablePopup };
