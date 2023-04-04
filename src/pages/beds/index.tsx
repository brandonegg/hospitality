import type { Bed} from "@prisma/client";
import { Role } from "@prisma/client";
import type { GetServerSidePropsContext, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";

import MainHeader from "../../components/Header";
import BedPopup from "../../components/beds/BedPopup";
import { AddButton } from "../../components/tables/buttons";
import type { TablePopup } from "../../components/tables/input";
import { TablePageHeader } from "../../components/tables/labels";
import { api } from "../../utils/api";

/**
 * Main beds table element.
 */
const BedsTable = () => {
    return (
        <div className="flex flex-col">
            <table className="w-full table-fixed text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-slate-800 text-sm uppercase text-gray-300">
                    <tr>
                        <th className="min-w-[200px] px-6 py-3 lg:w-1/4">Building</th>
                        <th className="min-w-[100px] px-6 py-3">Room</th>
                        <th className="min-w-[150px] px-6 py-3">Status</th>
                        <th className="max-w-[200px] min-w-[100px] px-6 py-3">Last Occupied</th>
                        <th className="max-w-[260px] min-w-[240px] px-6 py-3">Last Unoccupied</th>
                        <th className="max-w-[200px] min-w-[100px] px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>

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
    const [popup, setPopup] = useState<TablePopup<Bed>>({ show: false });

    // const { data, error, isLoading, fetchNextPage, refetch } =
    // api.bed.getAll.useInfiniteQuery(
    //   {
    //     limit,
    //   },
    //   {
    //     getNextPageParam: (lastPage) => lastPage.nextCursor,
    //   }
    // );

    return(
        <main className="mx-auto max-w-[1400px]">
            <MainHeader user={sessionData?.user} />
            <div className="m-6 gap-4 space-y-2">
              <div className="flex items-center justify-between">
                <TablePageHeader label="Beds" count={0} />
                <div>
                  <AddButton label="Bed" onClick={() => setPopup({ show: true, type: "create" })} />
                </div>
              </div>

              {/* Popup */}
              { popup.show && (
                <BedPopup
                  refetch={async () => {return;}}
                  popup={popup}
                  setPopup={setPopup}
                />
              )}
            </div>
            <div className="mx-6 overflow-x-auto rounded-xl border border-gray-600 drop-shadow-lg">
              <BedsTable />
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
