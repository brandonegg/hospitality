import type { Dispatch, SetStateAction } from "react";

import type { InvoiceRowData } from "../../pages/invoice/index";
import { TablePopup } from "../tables/input";

import InvoiceAddBill from "./InvoiceAddBill";
import InvoiceCreate from "./InvoiceCreate";
import InvoiceDelete from "./InvoiceDelete";
import InvoiceEdit from "./InvoiceEdit";
import InvoiceSendBill from "./InvoiceSendBill";

export type InvoicePopupTypes =
  | "create"
  | "sendBill"
  | "addBill"
  | "edit"
  | "delete";

interface InvoicePopupBodyProps {
  type?: "create" | "sendBill" | "addBill" | "edit" | "delete";
  Invoice?: InvoiceRowData;
  refetch: () => Promise<void>;
  popup: TablePopup<InvoiceRowData, InvoicePopupTypes>;
  setPopup: Dispatch<
    SetStateAction<TablePopup<InvoiceRowData, InvoicePopupTypes>>
  >;
}

/**
 * Invoice popup body component.
 */
const InvoicePopupBody = ({
  refetch,
  Invoice,
  type,
  popup,
  setPopup,
}: InvoicePopupBodyProps) => {
  switch (type) {
    case "create":
      return (
        <InvoiceCreate refetch={refetch} popup={popup} setPopup={setPopup} />
      );
    case "sendBill":
      return (
        <InvoiceSendBill
          refetch={refetch}
          invoice={Invoice}
          popup={popup}
          setPopup={setPopup}
        />
      );
    case "addBill":
      return (
        <InvoiceAddBill
          refetch={refetch}
          invoice={Invoice}
          popup={popup}
          setPopup={setPopup}
        />
      );
    case "edit":
      return (
        <InvoiceEdit
          refetch={refetch}
          invoice={Invoice}
          popup={popup}
          setPopup={setPopup}
        />
      );
    case "delete":
      return (
        <InvoiceDelete
          refetch={refetch}
          Invoice={Invoice}
          popup={popup}
          setPopup={setPopup}
        />
      );
    default:
      return <></>;
  }
};

interface InvoicePopupProps {
  refetch: () => Promise<void>;
  popup: TablePopup<InvoiceRowData, InvoicePopupTypes>;
  setPopup: Dispatch<
    SetStateAction<TablePopup<InvoiceRowData, InvoicePopupTypes>>
  >;
}

/**
 * Invoice popup body component.
 */
const InvoicePopup = ({ refetch, popup, setPopup }: InvoicePopupProps) => {
  return (
    <TablePopup<InvoiceRowData, InvoicePopupTypes>
      label="Invoice"
      popup={popup}
      setPopup={setPopup}
      refetch={refetch}
    >
      <InvoicePopupBody
        Invoice={popup.data}
        type={popup.type}
        refetch={refetch}
        popup={popup}
        setPopup={setPopup}
      />
    </TablePopup>
  );
};

export default InvoicePopup;
