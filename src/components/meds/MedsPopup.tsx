import type { Dispatch, SetStateAction } from "react";

import type { MedsRowData } from "../../pages/meds";
import { TablePopup } from "../tables/input";

import MedsCreate from "./MedsCreate";
import MedsDelete from "./MedsDelete";
import MedsEdit from "./MedsEdit";

export type MedsPopupTypes = "create" | "edit" | "delete";

interface MedsPopupBodyProps {
  type?: "create" | "edit" | "delete";
  meds?: MedsRowData;
  refetch: () => Promise<void>;
  popup: TablePopup<MedsRowData, MedsPopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<MedsRowData, MedsPopupTypes>>>;
}

/**
 * Meds popup body component.
 */
const MedsPopupBody = ({
  refetch,
  meds,
  type,
  popup,
  setPopup,
}: MedsPopupBodyProps) => {
  switch (type) {
    case "create":
      return <MedsCreate refetch={refetch} popup={popup} setPopup={setPopup} />;
    case "edit":
      return (
        <MedsEdit
          refetch={refetch}
          meds={meds}
          popup={popup}
          setPopup={setPopup}
        />
      );
    case "delete":
      return (
        <MedsDelete
          refetch={refetch}
          meds={meds}
          popup={popup}
          setPopup={setPopup}
        />
      );
    default:
      return <></>;
  }
};

interface MedsPopupProps {
  refetch: () => Promise<void>;
  popup: TablePopup<MedsRowData, MedsPopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<MedsRowData, MedsPopupTypes>>>;
}

/**
 * Meds popup body component.
 */
const MedsPopup = ({ refetch, popup, setPopup }: MedsPopupProps) => {
  return (
    <TablePopup<MedsRowData, MedsPopupTypes>
      label="Medication"
      popup={popup}
      setPopup={setPopup}
      refetch={refetch}
    >
      <MedsPopupBody
        meds={popup.data}
        type={popup.type}
        refetch={refetch}
        popup={popup}
        setPopup={setPopup}
      />
    </TablePopup>
  );
};

export default MedsPopup;
