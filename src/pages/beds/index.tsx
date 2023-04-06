import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Role } from "@prisma/client";
import type { GetServerSidePropsContext, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import type { Dispatch, SetStateAction} from "react";
import { useState } from "react";

import MainHeader from "../../components/Header";
import BedPopup from "../../components/beds/BedPopup";
import type { ButtonDetails } from "../../components/tables/buttons";
import { AddButton } from "../../components/tables/buttons";
import type { TablePopup } from "../../components/tables/input";
import { TablePageHeader } from "../../components/tables/labels";
import { ActionsEntry } from "../../components/tables/rows";
import type { RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import { addressToString } from "../../utils/text";

export type BedRowData = RouterOutputs["bed"]["getAll"]["items"][number];
export type BedOccupantData = BedRowData["occupant"];

/**
 * UI component for the assigned patient table cell.
 */
const AssignedPatientCell = ({occupant}: {
  occupant: BedOccupantData,
}) => {
  if (!occupant) {
    return (
      <p className="italic text-neutral-400">
        No patient assigned
      </p>
    );
  }

  return (
    <div>
      {occupant?.name}
    </div>
  );
};

/**
 * Component for a single row of the bed table
 */
const BedsTableRow = ({item, setPopup}: {
  item: BedRowData
  setPopup: Dispatch<SetStateAction<TablePopup<BedRowData>>>
}) => {
  const editDetails: ButtonDetails = {
    onClick: () => setPopup({ show: true, type: "edit", data: item }),
  };

  const deleteDetails: ButtonDetails = {
    onClick: () => setPopup({ show: true, type: "delete", data: item }),
  };

  return (
    <tr className="border-b-2 border-gray-200 bg-slate-100 text-base text-gray-700 hover:bg-slate-200">
      <td className="px-6 py-2">{addressToString(item.building)}</td>
      <td className="px-6 py-2">{item.room}</td>
      {item.userId ? (
        <td className="px-6 py-2 font-bold text-rose-600">occupied</td>
      ): (
        <td className="px-6 py-2 font-bold text-green-500">unoccupied</td>
      )}
      <td className="px-6 py-2">
        <AssignedPatientCell occupant={item.occupant} />
      </td>
      <td className="grid place-items-end px-2 py-2">
        <ActionsEntry editDetails={editDetails} deleteDetails={deleteDetails} label="Bed" />
      </td>
    </tr>
  );
};

/**
 * Main beds table element.
 */
const BedsTable = ({items, setPopup}: {
  items: BedRowData[] | undefined,
  setPopup: Dispatch<SetStateAction<TablePopup<BedRowData>>>
}) => {
    return (
        <div className="overflow-x-auto flex flex-col">
            <table className="w-full table-fixed text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-slate-800 text-sm uppercase text-gray-300">
                    <tr>
                        <th className="w-[200px] px-6 py-3 lg:w-1/2">Building</th>
                        <th className="w-[100px] px-6 py-3 lg:w-1/4">Room</th>
                        <th className="w-[100px] px-6 py-3 lg:w-1/4">Status</th>
                        <th className="w-[200px] px-6 py-3 lg:w-1/2">Assigned Patient</th>
                        <th className="w-[200px] px-6 py-3 lg:w-1/3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                  {items?.map((bed, index) => (
                    <BedsTableRow setPopup={setPopup} key={index} item={bed}/>
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
const BedsPage: NextPage = () => {
    const { data: sessionData } = useSession();
    const [page, setPage] = useState(0);
    const [limit] = useState<number>(10);
    const [popup, setPopup] = useState<TablePopup<BedRowData>>({ show: false });

    const { data, refetch, fetchNextPage } =
      api.bed.getAll.useInfiniteQuery(
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

    return(
        <main className="mx-auto max-w-[1400px]">
            <MainHeader user={sessionData?.user} />
            <div className="m-6 gap-4 space-y-2">
              <div className="flex items-center justify-between">
                <TablePageHeader label="Beds" count={bedsLength} />
                <div>
                  <AddButton label="Bed" onClick={() => setPopup({ show: true, type: "create" })} />
                </div>
              </div>
            </div>

            {/* Popup */}
            { popup.show && (
              <BedPopup
                refetch={refetch as unknown as () => Promise<void>}
                popup={popup}
                setPopup={setPopup}
              />
            )}

            { /* Page Selectors */ }
            <div className="mx-auto justify-center place-items-center flex space-x-4 flex-row mb-2">
              <div className="flex">
                {page !== 0 ?
                (
                  <button
                    className="w-28 text-center inline-flex justify-center cursor-pointer items-center gap-2 rounded-lg bg-blue-600 py-2 px-3 text-sm text-white hover:bg-blue-700"
                    onClick={handleFetchPreviousPage}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Previous
                  </button>
                ) : (
                  <div className="w-28">
                  </div>
                )}
              </div>
              <span className="flex justify-center font-semibold">
                Page {page + 1}
              </span>
              <div className="flex justify-end">
                {beds?.length === limit ?
                (
                  <button
                    className="w-28 inline-flex justify-center cursor-pointer items-center gap-2 rounded-lg bg-blue-600 py-2 px-3 text-sm text-white hover:bg-blue-700"
                    onClick={handleFetchNextPage}
                  >
                      Next <ChevronRightIcon className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="w-28">
                  </div>
                )}
              </div>
            </div>

            { /* Main Table */ }
            <div className="mx-6 overflow-x-auto rounded-xl border border-gray-600 drop-shadow-lg">
              <BedsTable setPopup={setPopup} items={beds} />
            </div>
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

    // If the user is not an admin, redirect to the dashboard
    if (session.user.role !== Role.ADMIN) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return { props: {} };
  };

export default BedsPage;
