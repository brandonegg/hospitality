import { Role } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";

import MainHeader from "../../components/Header";
import { AddButton } from "../../components/tables/buttons";
import { TablePageHeader } from "../../components/tables/labels";

/**
 * Rate table row.
 * @returns
 */
const RateTableRow = () => {
  return <></>;
};

/**
 * Rate table.
 * @returns
 */
const RateTable = () => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-600 drop-shadow-lg">
      <table className="w-full table-fixed text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-slate-800 text-sm uppercase text-gray-300">
          <tr>
            <th className="w-[200px] px-6 py-3 lg:w-1/3">Name</th>
            <th className="w-[200px] px-6 py-3 lg:w-1/3">Description</th>
            <th className="w-[175px] px-6 py-3">Rate</th>
            <th className="w-[220px] px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  );
};

/**
 * Rates page.
 * @returns
 */
const RatesPage = ({ user }: { user: Session["user"] }) => {
  return (
    <main className="mx-auto max-w-[1400px]">
      <MainHeader user={user} />
      <div className="m-6 gap-4 space-y-2">
        <div className="flex items-center justify-between">
          <TablePageHeader label="Rates" count={0} />
          <div>
            <AddButton
              label="Rate"
              // onClick={() => setPopup({ show: true, type: "create" })}
            />
          </div>
        </div>

        <RateTable />
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

  const authorizedUsers: Role[] = [Role.ADMIN];

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

export default RatesPage;
