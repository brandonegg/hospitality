import type { Dispatch, SetStateAction } from "react";

import type { RateRowData } from "../../pages/rates";
import { TablePopup } from "../tables/input";

import RateCreate from "./RateCreate";
import RateDelete from "./RateDelete";
import RateEdit from "./RateEdit";

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
      return <RateCreate refetch={refetch} popup={popup} setPopup={setPopup} />;
    case "edit":
      return (
        <RateEdit
          refetch={refetch}
          rate={rate}
          popup={popup}
          setPopup={setPopup}
        />
      );
    case "delete":
      return (
        <RateDelete
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
      label="rate"
      popup={popup}
      setPopup={setPopup}
      refetch={refetch}
    >
      <RatePopupBody refetch={refetch} popup={popup} setPopup={setPopup} />
    </TablePopup>
  );
};

export default RatePopup;
