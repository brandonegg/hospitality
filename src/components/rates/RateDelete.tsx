import type { Dispatch, SetStateAction } from "react";

import type { RateRowData } from "../../pages/rates";
import type { TablePopup } from "../tables/input";

import type { RatePopupTypes } from "./RatePopup";

interface RateDeleteProps {
  refetch: () => Promise<void>;
  rate?: RateRowData;
  popup: TablePopup<RateRowData, RatePopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<RateRowData, RatePopupTypes>>>;
}

/**
 * Rate delete component.
 * @returns
 */
const RateDelete = ({ refetch, rate, setPopup }: RateDeleteProps) => {
  return <></>;
};

export default RateDelete;
