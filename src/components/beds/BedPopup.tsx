import type { Bed } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";

import { TablePopup } from "../tables/input";

import BedCreate from "./BedCreate";

interface BedPopupBodyProps {
  type?: "create" | "edit" | "delete";
  bed?: Bed;
  refetch: () => Promise<void>;
  popup: TablePopup<Bed>;
  setPopup: Dispatch<SetStateAction<TablePopup<Bed>>>;
}

/**
 * User popup body component.
 * @param param0
 * @returns JSX
 */
const BedPopupBody = ({
  refetch,
  bed,
  type,
  popup,
  setPopup,
}: BedPopupBodyProps) => {
  switch (type) {
    case "create":
      return <BedCreate refetch={refetch} popup={popup} setPopup={setPopup} />;
    case "edit":
      return (
        <BedEdit
          refetch={refetch}
          bed={bed}
          popup={popup}
          setPopup={setPopup}
        />
      );
    case "delete":
      return (
        <BedDelete
          refetch={refetch}
          bed={bed}
          popup={popup}
          setPopup={setPopup}
        />
      );
    default:
      return <></>;
  }
};

interface BedPopupProps {
  refetch: () => Promise<void>;
  popup: TablePopup<Bed>;
  setPopup: Dispatch<SetStateAction<TablePopup<Bed>>>;
}

/**
 * User popup component.
 * @returns JSX
 */
const UserPopup = ({ refetch, popup, setPopup }: BedPopupProps) => {
  return (
    <TablePopup<Bed> label="Bed" popup={popup} setPopup={setPopup} refetch={refetch}>
        <BedPopupBody
            refetch={refetch}
            bed={popup.data}
            type={popup.type}
            popup={popup}
            setPopup={setPopup}
          />
    </TablePopup>
  );
};

export default UserPopup;
