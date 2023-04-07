import type { Dispatch, SetStateAction } from "react";

import type { BedRowData } from "../../pages/beds";
import { TablePopup } from "../tables/input";

import BedCreate from "./BedCreate";
import BedDelete from "./BedDelete";
import BedEdit from "./BedEdit";

interface BedPopupBodyProps {
  type?: "create" | "edit" | "delete";
  bed?: BedRowData;
  refetch: () => Promise<void>;
  popup: TablePopup<BedRowData>;
  setPopup: Dispatch<SetStateAction<TablePopup<BedRowData>>>;
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
  popup: TablePopup<BedRowData>;
  setPopup: Dispatch<SetStateAction<TablePopup<BedRowData>>>;
}

/**
 * User popup component.
 * @returns JSX
 */
const UserPopup = ({ refetch, popup, setPopup }: BedPopupProps) => {
  return (
    <TablePopup<BedRowData> label="Bed" popup={popup} setPopup={setPopup} refetch={refetch}>
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
