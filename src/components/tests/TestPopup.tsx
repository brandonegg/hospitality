import type { Dispatch, SetStateAction } from "react";

import type { TestRowData } from "../../pages/tests";
import { TablePopup } from "../tables/input";

import TestCreate from "./TestCreate";
import TestDelete from "./TestDelete";
import TestEdit from "./TestEdit";

export type TestPopupTypes = "create" | "edit" | "delete";

interface TestPopupBodyProps {
  type?: "create" | "edit" | "delete";
  test?: TestRowData;
  refetch: () => Promise<void>;
  popup: TablePopup<TestRowData, TestPopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<TestRowData, TestPopupTypes>>>;
}

/**
 * Test popup body component.
 */
const TestPopupBody = ({
  refetch,
  test,
  type,
  popup,
  setPopup,
}: TestPopupBodyProps) => {
  switch (type) {
    case "create":
      return <TestCreate refetch={refetch} popup={popup} setPopup={setPopup} />;
    case "edit":
      return (
        <TestEdit
          refetch={refetch}
          test={test}
          popup={popup}
          setPopup={setPopup}
        />
      );
    case "delete":
      return (
        <TestDelete
          refetch={refetch}
          test={test}
          popup={popup}
          setPopup={setPopup}
        />
      );
    default:
      return <></>;
  }
};

interface TestPopupProps {
  refetch: () => Promise<void>;
  popup: TablePopup<TestRowData, TestPopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<TestRowData, TestPopupTypes>>>;
}

/**
 * Test popup body component.
 */
const TestPopup = ({ refetch, popup, setPopup }: TestPopupProps) => {
  return (
    <TablePopup<TestRowData, TestPopupTypes>
      label="Test"
      popup={popup}
      setPopup={setPopup}
      refetch={refetch}
    >
      <TestPopupBody
        test={popup.data}
        type={popup.type}
        refetch={refetch}
        popup={popup}
        setPopup={setPopup}
      />
    </TablePopup>
  );
};

export default TestPopup;
