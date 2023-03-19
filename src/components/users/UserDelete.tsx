import type { Dispatch, SetStateAction } from "react";

import type { Popup } from "../../pages/users";

interface UserDeleteProps {
  popup: Popup;
  setPopup: Dispatch<SetStateAction<Popup>>;
}

/**
 * UserDelete component
 * @param param0
 * @returns JSX
 */
const UserDelete = ({ setPopup }: UserDeleteProps) => {
  return (
    <form className="flex flex-col gap-2">
      <p>Do you want to this delete this user?</p>

      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-blue-600 py-2 px-3 font-semibold text-white hover:bg-blue-700"
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={() => setPopup({ show: false })}
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-red-600 py-2 px-3 font-semibold text-white hover:bg-red-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserDelete;
