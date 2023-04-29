import type { Dispatch, SetStateAction } from "react";

import type { PrescribeRowData } from "../../pages/prescribe/index";
import { TablePopup } from "../tables/input";

import PrescribeAddBill from "./PrescribeAddMed";
import PrescribeCreate from "./PrescribeCreate";
import PrescribeDelete from "./PrescribeDelete";
import PrescribeEdit from "./PrescribeEdit";
import PrescribeRemoveBill from "./PrescribeRemoveMed";
import PrescribeSendBill from "./PrescribeSendBill";

export type PrescribePopupTypes =
  | "create"
  | "sendBill"
  | "addBill"
  | "removeBill"
  | "edit"
  | "delete";

interface PrescribePopupBodyProps {
  type?: PrescribePopupTypes;
  prescribe?: PrescribeRowData;
  refetch: () => Promise<void>;
  popup: TablePopup<PrescribeRowData, PrescribePopupTypes>;
  setPopup: Dispatch<
    SetStateAction<TablePopup<PrescribeRowData, PrescribePopupTypes>>
  >;
}

/**
 * Prescribe popup body component.
 */
const PrescribePopupBody = ({
  refetch,
  prescribe,
  type,
  popup,
  setPopup,
}: PrescribePopupBodyProps) => {
  switch (type) {
    case "create":
      return (
        <PrescribeCreate refetch={refetch} popup={popup} setPopup={setPopup} />
      );
    case "sendBill":
      return (
        <PrescribeSendBill
          refetch={refetch}
          prescribe={prescribe}
          popup={popup}
          setPopup={setPopup}
        />
      );
    case "addBill":
      return (
        <PrescribeAddBill
          refetch={refetch}
          prescribe={prescribe}
          popup={popup}
          setPopup={setPopup}
        />
      );
    case "removeBill":
      return (
        <PrescribeRemoveBill
          refetch={refetch}
          prescribe={prescribe}
          popup={popup}
          setPopup={setPopup}
        />
      );
    case "edit":
      return (
        <PrescribeEdit
          refetch={refetch}
          prescribe={prescribe}
          popup={popup}
          setPopup={setPopup}
        />
      );
    case "delete":
      return (
        <PrescribeDelete
          refetch={refetch}
          prescribe={prescribe}
          popup={popup}
          setPopup={setPopup}
        />
      );
    default:
      return <></>;
  }
};

interface PrescribePopupProps {
  refetch: () => Promise<void>;
  popup: TablePopup<PrescribeRowData, PrescribePopupTypes>;
  setPopup: Dispatch<
    SetStateAction<TablePopup<PrescribeRowData, PrescribePopupTypes>>
  >;
}

/**
 * Prescribe popup body component.
 */
const PrescribePopup = ({ refetch, popup, setPopup }: PrescribePopupProps) => {
  return (
    <TablePopup<PrescribeRowData, PrescribePopupTypes>
      label="Prescription"
      popup={popup}
      setPopup={setPopup}
      refetch={refetch}
    >
      <PrescribePopupBody
        prescribe={popup.data}
        type={popup.type}
        refetch={refetch}
        popup={popup}
        setPopup={setPopup}
      />
    </TablePopup>
  );
};

export default PrescribePopup;
