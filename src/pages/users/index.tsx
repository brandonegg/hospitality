import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { format } from "date-fns";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";

import MainHeader from "../../components/Header";
import { api } from "../../utils/api";
import { classNames } from "../../utils/text";

/**
 * Users page
 * @param props
 * @returns JSX
 */
const UsersPage: NextPage = () => {
  const { data: sessionData } = useSession();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const { data, error, isLoading, fetchNextPage } =
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
        <h1 className="text-3xl font-bold">All Users</h1>

        {isLoading && <div>Loading...</div>}

        {error && <div>Error: {error.message}</div>}

        {toShow && (
          <>
            <span>{usersLength} Users</span>

            <div className="grid-col-10 grid">
              {/* search bar */}
              <input
                type="text"
                placeholder="Search for users"
                className="col-start-1 col-end-9 w-full rounded-lg border border-gray-400 bg-gray-50 p-2 sm:col-end-4"
              />

              {/* add user button */}
              <div className="col-span-1 col-end-10 flex justify-end">
                <button className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 py-2 px-3 font-semibold text-white hover:bg-blue-700">
                  <PlusIcon className="h-4 w-4" />
                  Add User
                </button>
              </div>
            </div>

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
              <span className="flex justify-center">Page {page + 1}</span>
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

            <div className="overflow-x-auto rounded-xl border-gray-600 drop-shadow-lg">
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
                              JL
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
                          <button className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 py-2 px-3 text-white hover:bg-blue-700">
                            <PencilSquareIcon className="h-4 w-4" />
                            Edit
                          </button>
                          <button className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 py-2 px-3 text-white hover:bg-red-700">
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

export default UsersPage;
