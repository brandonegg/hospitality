import { Role } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";

import MainHeader from "../../components/Header";

/**
 * Main beds table element.
 */
const BedsTable = () => {
    return (
        <div className="flex flex-col">
            <div className="font-bold bg-neutral-200 text-xl text-center py-2">
                <h1>Beds</h1>
            </div>
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
const BedsPage = () => {
    const { data: sessionData } = useSession();

    return(
        <main className="mx-auto max-w-[1400px]">
            <MainHeader user={sessionData?.user} />
            <div className="m-6 overflow-x-auto rounded-xl border border-gray-600 drop-shadow-lg">
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
