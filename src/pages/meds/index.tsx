import { Role } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import PageSelector from "../../components/PageSelector";
import MedsPopup from "../../components/meds/MedsPopup";
import type { MedsPopupTypes } from "../../components/meds/MedsPopup";
import type { ButtonDetails } from "../../components/tables/buttons";
import { AddButton } from "../../components/tables/buttons";
import type { TablePopup } from "../../components/tables/input";
import { TablePageHeader } from "../../components/tables/labels";
import { ActionsEntry } from "../../components/tables/rows";
import type { UserPopupTypes } from "../../components/users/UserPopup";
import type { RouterOutputs } from "../../lib/api";
import { api } from "../../lib/api";

export type MedsRowData = RouterOutputs["meds"]["getAllPaged"]["items"][number];

/**
 * Med table row.
 * @returns
 */
const MedsTableRow = ({
  item,
  setPopup,
}: {
  item: MedsRowData;
  setPopup: Dispatch<SetStateAction<TablePopup<MedsRowData, MedsPopupTypes>>>;
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
      <td className="px-6 py-2">{item.dosageMin}</td>
      <td className="px-6 py-2">{item.dosageMax}</td>
      <td className="px-6 py-2">{item.unit}</td>
      <ActionsEntry
        editDetails={editDetails}
        deleteDetails={deleteDetails}
        label="Medication"
      />
    </tr>
  );
};

/**
 * Meds table.
 * @returns
 */
const MedsTable = ({
  items,
  setPopup,
}: {
  items: MedsRowData[] | undefined;
  setPopup: Dispatch<SetStateAction<TablePopup<MedsRowData, MedsPopupTypes>>>;
}) => {
  return (
    <div className="mx-6 overflow-x-auto rounded-xl border border-gray-600 drop-shadow-lg">
      <table className="w-full table-fixed text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-slate-800 text-sm uppercase text-gray-300">
          <tr>
            <th className="w-[200px] px-6 py-3 lg:w-1/4">Name</th>
            <th className="w-[200px] px-6 py-3 lg:w-1/4">Minimum Dosage</th>
            <th className="w-[125px] px-6 py-3">Maximum Dosage</th>
            <th className="w-[125px] px-6 py-3">Unit</th>
            <th className="w-[220px] px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((med, i) => (
            <MedsTableRow key={i} item={med} setPopup={setPopup} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Meds page.
 * @returns
 */
const MedsPage = () => {
  const [page, setPage] = useState<number>(0);
  const [limit] = useState<number>(10);
  const [popup, setPopup] = useState<TablePopup<MedsRowData, UserPopupTypes>>({
    show: false,
  });

  const { data, refetch, fetchNextPage } =
    api.meds.getAllPaged.useInfiniteQuery(
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

  const medsLength = data?.pages[page]?.count;
  const meds = data?.pages[page]?.items;

  return (
    <main className="mx-auto mb-4 max-w-[1400px]">
      <div className="m-6 gap-4 space-y-2">
        <div className="flex items-center justify-between">
          <TablePageHeader label="Medications" count={medsLength} />
          <div>
            <AddButton
              label="Medication"
              onClick={() => setPopup({ show: true, type: "create" })}
            />
          </div>
        </div>
      </div>

      {/* popup */}
      {popup.show && (
        <MedsPopup
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
        items={meds}
      />

      {/* main table */}
      <MedsTable items={meds} setPopup={setPopup} />
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

export default MedsPage;
