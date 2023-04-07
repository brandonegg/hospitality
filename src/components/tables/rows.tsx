import type { ButtonDetails} from "./buttons";
import { DeleteRowButton, EditRowButton } from "./buttons";

/**
 * Creates the row entry for the actions column
 */
const ActionsEntry = ({ editDetails, deleteDetails } :
    {
        label: string,
        editDetails: ButtonDetails,
        deleteDetails: ButtonDetails,
    }) => {
        return (
            <td className="">
                <div className="flex w-full gap-2">
                    <EditRowButton {...editDetails} />
                    <DeleteRowButton {...deleteDetails} />
                </div>
            </td>
        );
    };

export {
    ActionsEntry,
};
