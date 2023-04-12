import type { Dispatch, SetStateAction } from "react";

import type { RateRowData } from "../../pages/rates";
import type { TablePopup } from "../tables/input";

import type { RatePopupTypes } from "./RatePopup";

interface RateEditProps {
  refetch: () => Promise<void>;
  rate?: RateRowData;
  popup: TablePopup<RateRowData, RatePopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<RateRowData, RatePopupTypes>>>;
}

/**
 * Rate edit component.
 * @returns
 */
const RateEdit = ({ refetch, rate, setPopup }: RateEditProps) => {
  return <></>;
};

export default RateEdit;
