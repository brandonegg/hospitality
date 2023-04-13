import { Role } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import MainHeader from "../../components/Header";
import PageSelector from "../../components/PageSelector";
import type { RatePopupTypes } from "../../components/rates/RatePopup";
import RatePopup from "../../components/rates/RatePopup";
import type { ButtonDetails } from "../../components/tables/buttons";
import { AddButton } from "../../components/tables/buttons";
import type { TablePopup } from "../../components/tables/input";
import { TablePageHeader } from "../../components/tables/labels";
import { ActionsEntry } from "../../components/tables/rows";
import type { UserPopupTypes } from "../../components/users/UserPopup";
import type { RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";

export type RateRowData = RouterOutputs["rate"]["getAll"]["items"][number];

/**
 * Rate table row.
 * @returns
 */
const RateTableRow = ({
  item,
  setPopup,
}: {
  item: RateRowData;
  setPopup: Dispatch<SetStateAction<TablePopup<RateRowData, RatePopupTypes>>>;
}) => {
  const editDetails: ButtonDetails = {
    onClick: () => setPopup({ show: true, type: "edit", data: item }),
  };

  const deleteDetails: ButtonDetails = {
    onClick: () => setPopup({ show: true, type: "delete", data: item }),
  };

  return (
    <tr className="border-b-2 border-gray-200 bg-slate-100 text-base text-gray-700 hover:bg-slate-200">
      <td className="px-6 py-2">{item.name}</td>
      <td className="px-6 py-2">{item.description}</td>
      <td className="px-6 py-2">{item.rate}</td>
      <ActionsEntry
        editDetails={editDetails}
        deleteDetails={deleteDetails}
        label="Rate"
      />
    </tr>
  );
};

/**
 * Rate table.
 * @returns
 */
const RateTable = ({
  items,
  setPopup,
}: {
  items: RateRowData[] | undefined;
  setPopup: Dispatch<SetStateAction<TablePopup<RateRowData, RatePopupTypes>>>;
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-600 drop-shadow-lg">
      <table className="w-full table-fixed text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-slate-800 text-sm uppercase text-gray-300">
          <tr>
            <th className="w-[200px] px-6 py-3 lg:w-1/3">Name</th>
            <th className="w-[200px] px-6 py-3 lg:w-1/3">Description</th>
            <th className="w-[125px] px-6 py-3">Rate</th>
            <th className="w-[220px] px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((rate, i) => (
            <RateTableRow key={i} item={rate} setPopup={setPopup} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Rates page.
 * @returns
 */
const RatesPage = ({ user }: { user: Session["user"] }) => {
  const [page, setPage] = useState<number>(0);
  const [limit] = useState<number>(10);
  const [popup, setPopup] = useState<TablePopup<RateRowData, UserPopupTypes>>({
    show: false,
  });

  const { data, refetch, fetchNextPage } = api.rate.getAll.useInfiniteQuery(
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

  const ratesLength = data?.pages[page]?.count;
  const rates = data?.pages[page]?.items;

  return (
    <main className="mx-auto max-w-[1400px]">
      <MainHeader user={user} />
      <div className="m-6 gap-4 space-y-2">
        <div className="flex items-center justify-between">
          <TablePageHeader label="Rates" count={ratesLength} />
          <div>
            <AddButton
              label="Rate"
              onClick={() => setPopup({ show: true, type: "create" })}
            />
          </div>
        </div>

        {/* popup */}
        {popup.show && (
          <RatePopup
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
          items={rates}
        />

        {/* main table */}
        <RateTable items={rates} setPopup={setPopup} />
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
