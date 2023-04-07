import type { Dispatch, SetStateAction } from "react";

import type { UserRowData } from "../../pages/users";
import { TablePopup } from "../tables/input";

import UserCreate from "./UserCreate";
import UserDelete from "./UserDelete";
import UserEdit from "./UserEdit";

export type UserPopupTypes = "create" | "edit" | "delete";

interface UserPopupBodyProps {
  type?: "create" | "edit" | "delete";
  user?: UserRowData;
  refetch: () => Promise<void>;
  popup: TablePopup<UserRowData, UserPopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<UserRowData, UserPopupTypes>>>;
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
  popup: TablePopup<UserRowData, UserPopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<UserRowData, UserPopupTypes>>>;
}

/**
 * User popup component.
 * @returns JSX
 */
const UserPopup = ({ refetch, popup, setPopup }: UserPopupProps) => {
  return (
    <TablePopup<UserRowData, UserPopupTypes> label="User" popup={popup} setPopup={setPopup} refetch={refetch}>
        <UserPopupBody
            refetch={refetch}
            user={popup.data}
            type={popup.type}
            popup={popup}
            setPopup={setPopup}
          />
    </TablePopup>
  );
};

export default UserPopup;
