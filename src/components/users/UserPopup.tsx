import { Dialog } from "@headlessui/react";
import type { Dispatch, SetStateAction } from "react";

import type { Popup, User } from "../../pages/users";

import UserCreate from "./UserCreate";
import UserDelete from "./UserDelete";
import UserEdit from "./UserEdit";

interface UserPopupTitleProps {
  type?: "create" | "edit" | "delete";
}

/**
 * User popup title component.
 * @param type Popup type.
 * @returns JSX
 */
const UserPopupTitle = ({ type }: UserPopupTitleProps) => {
  switch (type) {
    case "create":
      return <>Create User</>;
    case "edit":
      return <>Edit User</>;
    case "delete":
      return <>Delete User</>;
    default:
      return <></>;
  }
};

interface UserPopupBodyProps {
  type?: "create" | "edit" | "delete";
  user?: User;
  refetch: () => Promise<void>;
  popup: Popup;
  setPopup: Dispatch<SetStateAction<Popup>>;
}

/**
 * User popup body component.
 * @param param0
 * @returns JSX
 */
const UserPopupBody = ({
  refetch,
  user,
  type,
  popup,
  setPopup,
}: UserPopupBodyProps) => {
  switch (type) {
    case "create":
      return <UserCreate refetch={refetch} popup={popup} setPopup={setPopup} />;
    case "edit":
      return (
        <UserEdit
          refetch={refetch}
          user={user}
          popup={popup}
          setPopup={setPopup}
        />
      );
    case "delete":
      return (
        <UserDelete
          refetch={refetch}
          user={user}
          popup={popup}
          setPopup={setPopup}
        />
      );
    default:
      return <></>;
  }
};

interface UserPopupProps {
  refetch: () => Promise<void>;
  popup: Popup;
  setPopup: Dispatch<SetStateAction<Popup>>;
}

/**
 * User popup component.
 * @returns JSX
 */
const UserPopup = ({ refetch, popup, setPopup }: UserPopupProps) => {
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
            <UserPopupTitle type={popup.type} />
          </Dialog.Title>

          <UserPopupBody
            refetch={refetch}
            user={popup.user}
            type={popup.type}
            popup={popup}
            setPopup={setPopup}
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default UserPopup;
