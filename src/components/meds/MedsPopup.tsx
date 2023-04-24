import type { Dispatch, SetStateAction } from "react";

import type { RateRowData } from "../../pages/meds";
import { TablePopup } from "../tables/input";

import MedsCreate from "./MedsCreate";
import MedsDelete from "./MedsDelete";
import MedsEdit from "./MedsEdit";

export type RatePopupTypes = "create" | "edit" | "delete";

interface RatePopupBodyProps {
  type?: "create" | "edit" | "delete";
  rate?: RateRowData;
  refetch: () => Promise<void>;
  popup: TablePopup<RateRowData, RatePopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<RateRowData, RatePopupTypes>>>;
}

/**
 * Rate popup body component.
 */
const RatePopupBody = ({
  refetch,
  rate,
  type,
  popup,
  setPopup,
}: RatePopupBodyProps) => {
  switch (type) {
    case "create":
      return <MedsCreate refetch={refetch} popup={popup} setPopup={setPopup} />;
    case "edit":
      return (
        <MedsEdit
          refetch={refetch}
          rate={rate}
          popup={popup}
          setPopup={setPopup}
        />
      );
    case "delete":
      return (
        <MedsDelete
          refetch={refetch}
          rate={rate}
          popup={popup}
          setPopup={setPopup}
        />
      );
    default:
      return <></>;
  }
};

interface RatePopupProps {
  refetch: () => Promise<void>;
  popup: TablePopup<RateRowData, RatePopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<RateRowData, RatePopupTypes>>>;
}

/**
 * Rate popup body component.
 */
const RatePopup = ({ refetch, popup, setPopup }: RatePopupProps) => {
  return (
    <TablePopup<RateRowData, RatePopupTypes>
      label="Rate"
      popup={popup}
      setPopup={setPopup}
      refetch={refetch}
    >
      <RatePopupBody
        rate={popup.data}
        type={popup.type}
        refetch={refetch}
        popup={popup}
        setPopup={setPopup}
      />
    </TablePopup>
  );
};

export default RatePopup;
