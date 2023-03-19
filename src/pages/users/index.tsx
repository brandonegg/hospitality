import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { Role } from "@prisma/client";
import { format } from "date-fns";
import type { GetServerSidePropsContext, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";

import Alert from "../../components/Alert";
import MainHeader from "../../components/Header";
import UserPopup from "../../components/users/UsersPopup";
import type { RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import { classNames } from "../../utils/text";

export type User = RouterOutputs["user"]["getAll"]["items"][number];

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

export type Popup = {
  show: boolean;
  type?: "create" | "edit" | "delete";
  user?: User;
};

/**
 * Users page
 * @param props
 * @returns JSX
 */
const UsersPage: NextPage = () => {
  const { data: sessionData } = useSession();

  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [popup, setPopup] = useState<Popup>({ show: false });

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
  const toShow = data?.pages[page]?.items;

  return (
    <main className="mx-auto max-w-[1400px]">
      <MainHeader user={sessionData?.user} />
      <div className="m-6 gap-4 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">All Users</h1>
            {toShow && <span>{usersLength} Users</span>}
          </div>

          {/* add user button */}
          {toShow && (
            <div className="">
              <button
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 py-2 px-3 font-semibold text-white hover:bg-blue-700"
                onClick={() => setPopup({ show: true, type: "create" })}
              >
                <PlusIcon className="h-4 w-4" />
                Add User
              </button>
            </div>
          )}
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

        {toShow && (
          <>
            <div className="grid grid-cols-3 items-center">
              <div className="flex">
                <button
                  className={classNames(
                    "inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 py-2 px-3 font-semibold text-white hover:bg-blue-700",
                    page === 0 ? "hidden" : ""
                  )}
                  onClick={handleFetchPreviousPage}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  Previous
                </button>
              </div>
              <span className="flex justify-center font-semibold">
                Page {page + 1}
              </span>
              <div className="flex justify-end">
                <button
                  className={classNames(
                    "inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 py-2 px-3 font-semibold text-white hover:bg-blue-700",
                    toShow.length !== limit ? "hidden" : ""
                  )}
                  onClick={handleFetchNextPage}
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-600 drop-shadow-lg">
              <table className="w-full table-fixed text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-slate-800 text-sm uppercase text-gray-300">
                  <tr>
                    <th className="w-[200px] px-6 py-3 lg:w-1/3">Name</th>
                    <th className="w-[200px] px-6 py-3 lg:w-1/3">Email</th>
                    <th className="w-[175px] px-6 py-3">Date of Birth</th>
                    <th className="w-[100px] px-6 py-3">Role</th>
                    <th className="w-[220px] px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {toShow.map((user, index) => (
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
                        {format(user.dateOfBirth as Date, "MM/dd/yyyy")}
                      </td>
                      <td className="px-6 py-2">{user.role}</td>
                      <td className="px-6 py-2">
                        <div className="flex gap-2">
                          <button
                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 py-2 px-3 font-semibold text-white hover:bg-blue-700"
                            onClick={() =>
                              setPopup({ show: true, type: "edit", user })
                            }
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 py-2 px-3 font-semibold text-white hover:bg-red-700"
                            onClick={() =>
                              setPopup({ show: true, type: "delete", user })
                            }
                          >
                            <TrashIcon className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
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
};

export default UsersPage;
