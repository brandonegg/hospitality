import type { Dispatch, SetStateAction } from "react";

import type { RateRowData } from "../../pages/rates";
import type { TablePopup } from "../tables/input";

import type { RatePopupTypes } from "./RatePopup";

interface RateCreateProps {
  refetch: () => Promise<void>;
  popup: TablePopup<RateRowData, RatePopupTypes>;
  setPopup: Dispatch<SetStateAction<TablePopup<RateRowData, RatePopupTypes>>>;
}

/**
 * Rate delete component.
 * @returns
 */
const RateCreate = ({ refetch, setPopup }: RateCreateProps) => {
  return <></>;
};

export default RateCreate;
