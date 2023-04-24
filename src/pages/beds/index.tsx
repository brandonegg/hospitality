import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { Role } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import PageSelector from "../../components/PageSelector";
import type { BedPopupTypes } from "../../components/beds/BedPopup";
import BedPopup from "../../components/beds/BedPopup";
import type { ButtonDetails } from "../../components/tables/buttons";
import { AddButton } from "../../components/tables/buttons";
import type { TablePopup } from "../../components/tables/input";
import { TablePageHeader } from "../../components/tables/labels";
import { ActionsEntry } from "../../components/tables/rows";
import type { RouterOutputs } from "../../lib/api";
import { api } from "../../lib/api";
import { addressToString } from "../../lib/text";

export type BedRowData = RouterOutputs["bed"]["getAll"]["items"][number];
export type BedOccupantData = BedRowData["occupant"];

/**
 * Renders action entries for beds table according to account type.
 */
const BedsActionsEntry = ({
  user,
  assignDetails,
  editDetails,
  deleteDetails,
}: {
  user: Session["user"];
  editDetails: ButtonDetails;
  deleteDetails: ButtonDetails;
  assignDetails: ButtonDetails;
}) => {
  if (user.role === Role.ADMIN) {
    return (
      <ActionsEntry
        editDetails={editDetails}
        deleteDetails={deleteDetails}
        label="Bed"
      />
    );
  }

  return (
    <td className="">
      <div className="justify-right flex w-full justify-end gap-2 p-2">
        <button
          data-testid={assignDetails.testId}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 py-2 px-3 font-semibold text-white hover:bg-blue-700"
          onClick={assignDetails.onClick}
        >
          <PencilSquareIcon className="h-4 w-4" />
          Assign
        </button>
      </div>
    </td>
  );
};

/**
 * UI component for the assigned patient table cell.
 */
const AssignedPatientCell = ({ occupant }: { occupant: BedOccupantData }) => {
  if (!occupant) {
    return <p className="italic text-neutral-400">No patient assigned</p>;
  }

  return <div>{occupant?.name}</div>;
};

/**
 * Component for a single row of the bed table
 */
const BedsTableRow = ({
  item,
  setPopup,
  user,
}: {
  item: BedRowData;
  setPopup: Dispatch<SetStateAction<TablePopup<BedRowData, BedPopupTypes>>>;
  user: Session["user"];
}) => {
  const editDetails: ButtonDetails = {
    onClick: () => setPopup({ show: true, type: "edit", data: item }),
    disabled: false,
  };

  const deleteDetails: ButtonDetails = {
    onClick: () => setPopup({ show: true, type: "delete", data: item }),
    disabled: item.occupant !== null,
  };

  const assignDetails: ButtonDetails = {
    onClick: () => setPopup({ show: true, type: "assign", data: item }),
    disabled: item.occupant !== null,
  };

  return (
    <tr className="border-b-2 border-gray-200 bg-slate-100 text-base text-gray-700 hover:bg-slate-200">
      <td className="px-6 py-2">{addressToString(item.building)}</td>
      <td className="px-6 py-2">{item.room}</td>
      {item.userId ? (
        <td className="px-6 py-2 font-bold text-rose-600">occupied</td>
      ) : (
        <td className="px-6 py-2 font-bold text-green-500">unoccupied</td>
      )}
      <td className="px-6 py-2">
        <AssignedPatientCell occupant={item.occupant} />
      </td>
      <BedsActionsEntry
        user={user}
        editDetails={editDetails}
        deleteDetails={deleteDetails}
        assignDetails={assignDetails}
      />
    </tr>
  );
};

/**
 * Main beds table element.
 */
const BedsTable = ({
  items,
  setPopup,
  user,
}: {
  items: BedRowData[] | undefined;
  setPopup: Dispatch<SetStateAction<TablePopup<BedRowData, BedPopupTypes>>>;
  user: Session["user"];
}) => {
  return (
    <div className="mx-6 overflow-x-auto rounded-xl border border-gray-600 drop-shadow-lg">
      <table className="w-full table-fixed text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-slate-800 text-sm uppercase text-gray-300">
          <tr>
            <th className="w-[200px] px-6 py-3 lg:w-1/2">Building</th>
            <th className="w-[100px] px-6 py-3 lg:w-1/4">Room</th>
            <th className="w-[100px] px-6 py-3 lg:w-1/4">Status</th>
            <th className="w-[200px] px-6 py-3 lg:w-1/2">Assigned Patient</th>
            <th className="w-[200px] px-6 py-3 text-right lg:w-1/3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((bed, index) => (
            <BedsTableRow
              user={user}
              setPopup={setPopup}
              key={index}
              item={bed}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Beds Table view for creating, modifying, and deleting beds
 * @returns
 */
const BedsPage = ({ user }: { user: Session["user"] }) => {
  const [page, setPage] = useState(0);
  const [limit] = useState<number>(10);
  const [popup, setPopup] = useState<TablePopup<BedRowData, BedPopupTypes>>({
    show: false,
  });

  const { data, refetch, fetchNextPage } = api.bed.getAll.useInfiniteQuery(
    {
      limit,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  /**
   * Fetch next page of users.
   * @returns
   */
  const handleFetchNextPage = async () => {
    await fetchNextPage();
    setPage((prev) => prev + 1);
  };

  /**
   * Fetch previous page of users.
   * @returns
   */
  const handleFetchPreviousPage = () => {
    setPage((prev) => prev - 1);
  };

  const bedsLength = data?.pages[page]?.count;
  const beds = data?.pages[page]?.items;

  return (
    <main className="mx-auto mb-4 max-w-[1400px]">
      <div className="m-6 gap-4 space-y-2">
        <div className="flex items-center justify-between">
          <TablePageHeader label="Beds" count={bedsLength} />
          <div>
            <AddButton
              label="Bed"
              onClick={() => setPopup({ show: true, type: "create" })}
            />
          </div>
        </div>
      </div>

      {/* Popup */}
      {popup.show && (
        <BedPopup
          refetch={refetch as unknown as () => Promise<void>}
          popup={popup}
          setPopup={setPopup}
        />
      )}

      {/* Page Selectors */}
      <PageSelector
        page={page}
        limit={limit}
        handleFetchNextPage={handleFetchNextPage}
        handleFetchPreviousPage={handleFetchPreviousPage}
        items={beds}
      />

      {/* Main Table */}
      <BedsTable user={user} setPopup={setPopup} items={beds} />
    </main>
  );
};

/**
 * Server side page setup
 * @param context
 * @returns
 */
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // Get the user session
  const session = await getSession(context);

  // If the user is not logged in, redirect to the login page
  if (!session?.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const authorizedUsers: Role[] = [Role.ADMIN, Role.DOCTOR, Role.NURSE];

  // If the user is not an admin, redirect to the dashboard
  if (!authorizedUsers.includes(session.user.role)) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user,
    },
  };
};

export default BedsPage;
