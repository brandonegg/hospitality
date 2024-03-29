import { Role } from "@prisma/client";
import type { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";

import Alert from "../../components/Alert";
import PageSelector from "../../components/PageSelector";
import {
  AddButton,
  DeleteRowButton,
  EditRowButton,
} from "../../components/tables/buttons";
import type { TablePopup } from "../../components/tables/input";
import { TablePageHeader } from "../../components/tables/labels";
import type { UserPopupTypes } from "../../components/users/UserPopup";
import UserPopup from "../../components/users/UserPopup";
import type { RouterOutputs } from "../../lib/api";
import { api } from "../../lib/api";
import { dateFormatter } from "../../lib/date";

export type UserRowData = RouterOutputs["user"]["getAll"]["items"][number];

/**
 * Get the initials of a name.
 * @param string
 * @returns
 */
const getInitial = (name: string) => {
  const names = name.split(" ");
  let initials = names[0]?.substring(0, 1).toUpperCase();

  if (initials && names.length > 1) {
    initials += names[names.length - 1]?.substring(0, 1).toUpperCase();
  }
  return initials;
};

/**
 * Users page
 * @param props
 * @returns JSX
 */
const UsersPage: NextPage = () => {
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [popup, setPopup] = useState<TablePopup<UserRowData, UserPopupTypes>>({
    show: false,
  });

  const { data, error, isLoading, fetchNextPage, refetch } =
    api.user.getAll.useInfiniteQuery(
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

  // items in the current page
  const usersLength = data?.pages[page]?.count;
  const users = data?.pages[page]?.items;

  return (
    <main className="mx-auto mb-4 max-w-[1400px]">
      <div className="m-6 gap-4 space-y-2">
        <div className="flex items-center justify-between">
          <TablePageHeader label="Users" count={usersLength} />
          <div>
            <AddButton
              label="User"
              onClick={() => setPopup({ show: true, type: "create" })}
            />
          </div>
        </div>
      </div>

      {/* popup */}
      {popup.show && (
        <UserPopup
          refetch={refetch as unknown as () => Promise<void>}
          popup={popup}
          setPopup={setPopup}
        />
      )}

      {isLoading && <div>Loading...</div>}

      {error && <Alert type="error">{error.message}</Alert>}

      {users && (
        <>
          {/* Page Selectors */}
          <PageSelector
            page={page}
            limit={limit}
            handleFetchNextPage={handleFetchNextPage}
            handleFetchPreviousPage={handleFetchPreviousPage}
            items={users}
          />

          <div className="mx-6 overflow-x-auto rounded-xl border border-gray-600 drop-shadow-lg">
            <table className="w-full table-fixed text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-slate-800 text-sm uppercase text-gray-300">
                <tr>
                  <th className="w-[200px] px-6 py-3 lg:w-1/3">Name</th>
                  <th className="w-[200px] px-6 py-3 lg:w-1/3">Email</th>
                  <th className="w-[175px] px-6 py-3">Date of Birth</th>
                  <th className="w-[100px] px-6 py-3">Role</th>
                  <th className="w-[220px] px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={index}
                    className="border-b-2 border-gray-200 bg-slate-100 text-base text-gray-700 hover:bg-slate-200"
                  >
                    <td className="px-6 py-2">
                      <div className="flex items-center gap-2">
                        <div className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
                          <span className="font-normal text-gray-600 dark:text-gray-300">
                            {getInitial(user.name)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold">{user.name}</span>
                          <span className="text-sm font-medium text-gray-400">
                            {user.username}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-2">{user.email}</td>
                    <td className="px-6 py-2">
                      {dateFormatter.format(user.dateOfBirth as Date)}
                    </td>
                    <td className="px-6 py-2">{user.role}</td>
                    <td className="px-6 py-2">
                      <div className="flex gap-2">
                        <EditRowButton
                          testId={`edit-${index}`}
                          onClick={() =>
                            setPopup({ show: true, type: "edit", data: user })
                          }
                        />
                        <DeleteRowButton
                          testId={`delete-${index}`}
                          onClick={() =>
                            setPopup({
                              show: true,
                              type: "delete",
                              data: user,
                            })
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
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

export default UsersPage;
