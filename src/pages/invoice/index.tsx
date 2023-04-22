import {
  DocumentMinusIcon,
  DocumentPlusIcon,
  EnvelopeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { Role } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import PageSelector from "../../components/PageSelector";
import type { InvoicePopupTypes } from "../../components/invoice/InvoicePopup";
import InvoicePopup from "../../components/invoice/InvoicePopup";
import type { ButtonDetails } from "../../components/tables/buttons";
import { AddButton } from "../../components/tables/buttons";
import { DeleteRowButton } from "../../components/tables/buttons";
import type { TablePopup } from "../../components/tables/input";
import { TablePageHeader } from "../../components/tables/labels";
import type { RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";

/**
 * Button for editing the row of a table.
 */
const EditRowButton = ({
  onClick,
  testId,
  disabled = false,
}: ButtonDetails) => {
  if (disabled) {
    return (
      <button
        data-testid={testId}
        className="editButtons inline-flex cursor-pointer cursor-not-allowed items-center gap-2 rounded-lg bg-blue-300 py-2 px-3 font-semibold text-white"
        onClick={onClick}
      >
        <PencilSquareIcon className="h-4 w-4" />
        Edit
      </button>
    );
  }

  return (
    <button
      data-testid={testId}
      className="editButtons inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 py-2 px-3 font-semibold text-white hover:bg-blue-700"
      onClick={onClick}
    >
      <PencilSquareIcon className="h-4 w-4" />
      Edit
    </button>
  );
};

/**
 * Button for sending the invoice of a table to patient.
 */
const SendBillRowButton = ({
  onClick,
  testId,
  disabled = false,
}: ButtonDetails) => {
  if (disabled) {
    return (
      <button
        data-testid={testId}
        className="inline-flex cursor-pointer cursor-not-allowed items-center gap-2 rounded-lg bg-gray-300 py-2 px-3 font-semibold text-white"
        onClick={onClick}
      >
        <EnvelopeIcon className="h-4 w-4" />
        Send
      </button>
    );
  }

  return (
    <button
      data-testid={testId}
      className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-600 py-2 px-3 font-semibold text-white hover:bg-gray-700"
      onClick={onClick}
    >
      <EnvelopeIcon className="h-4 w-4" />
      Send
    </button>
  );
};

/**
 * Button for sending the invoice of a table to patient.
 */
const AddBillRowButton = ({
  onClick,
  testId,
  disabled = false,
}: ButtonDetails) => {
  if (disabled) {
    return (
      <button
        data-testid={testId}
        className="inline-flex cursor-pointer cursor-not-allowed items-center gap-2 rounded-lg bg-lime-300 py-2 px-3 font-semibold text-white"
        onClick={onClick}
      >
        <DocumentPlusIcon className="h-4 w-4" />
        Add Bill
      </button>
    );
  }

  return (
    <button
      data-testid={testId}
      className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-lime-600 py-2 px-3 font-semibold text-white hover:bg-lime-700"
      onClick={onClick}
    >
      <DocumentPlusIcon className="h-4 w-4" />
      Add Bill
    </button>
  );
};

/**
 * Button for sending the invoice of a table to patient.
 */
const RemoveBillRowButton = ({
  onClick,
  testId,
  disabled = false,
}: ButtonDetails) => {
  if (disabled) {
    return (
      <button
        data-testid={testId}
        className="inline-flex cursor-pointer cursor-not-allowed items-center gap-2 rounded-lg bg-amber-300 py-2 px-3 font-semibold text-white"
        onClick={onClick}
      >
        <DocumentMinusIcon className="h-4 w-4" />
        Remove Bill
      </button>
    );
  }

  return (
    <button
      data-testid={testId}
      className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-amber-600 py-2 px-3 font-semibold text-white hover:bg-amber-700"
      onClick={onClick}
    >
      <DocumentMinusIcon className="h-4 w-4" />
      Remove Bill
    </button>
  );
};

/**
 * Creates the row entry for the actions column
 */
const ActionsEntry = ({
  sendBillDetails,
  addBillDetails,
  removeBillDetails,
  editDetails,
  deleteDetails,
}: {
  label: string;
  sendBillDetails: ButtonDetails;
  addBillDetails: ButtonDetails;
  removeBillDetails: ButtonDetails;
  editDetails: ButtonDetails;
  deleteDetails: ButtonDetails;
}) => {
  return (
    <td className="">
      <div className="flex w-full justify-end gap-2 p-2">
        <SendBillRowButton {...sendBillDetails} />
        <AddBillRowButton {...addBillDetails} />
        <RemoveBillRowButton {...removeBillDetails} />
        <EditRowButton {...editDetails} />
        <DeleteRowButton {...deleteDetails} />
      </div>
    </td>
  );
};

export type InvoiceRowData =
  RouterOutputs["invoice"]["getAll"]["items"][number];

/**
 * Invoice table row.
 * @returns
 */
const InvoiceTableRow = ({
  item,
  setPopup,
}: {
  item: InvoiceRowData;
  setPopup: Dispatch<
    SetStateAction<TablePopup<InvoiceRowData, InvoicePopupTypes>>
  >;
}) => {
  const sendBillDetails: ButtonDetails = {
    onClick: () => setPopup({ show: true, type: "sendBill", data: item }),
  };
  const addBillDetails: ButtonDetails = {
    onClick: () => setPopup({ show: true, type: "addBill", data: item }),
  };
  const removeBillDetails: ButtonDetails = {
    onClick: () => setPopup({ show: true, type: "removeBill", data: item }),
  };
  const editDetails: ButtonDetails = {
    onClick: () => {
      setPopup({ show: true, type: "edit", data: item });
    },
  };

  const deleteDetails: ButtonDetails = {
    onClick: () => setPopup({ show: true, type: "delete", data: item }),
  };

  /**
   * Get the user name based off an id
   * @param id
   * @returns
   */
  function getName(id: string): string | undefined {
    const { data: name } = api.invoice.getName.useQuery({ id: id });
    return name?.name;
  }
  return (
    <tr className="border-b-2 border-gray-200 bg-slate-100 text-base text-gray-700 hover:bg-slate-200">
      <td className="px-6 py-2">{getName(item.userId ?? "")}</td>
      <td className="px-6 py-2">{item.total}</td>
      <td className="px-6 py-2">{item.totalDue}</td>

      <td className="px-6 py-2">
        {new Date(
          item.paymentDue.getTime() -
            item.paymentDue.getTimezoneOffset() * -60000
        )
          .toISOString()
          .slice(0, 10)}
      </td>
      <ActionsEntry
        sendBillDetails={sendBillDetails}
        addBillDetails={addBillDetails}
        removeBillDetails={removeBillDetails}
        editDetails={editDetails}
        deleteDetails={deleteDetails}
        label="Invoice"
      />
    </tr>
  );
};

/**
 * Invoice table.
 * @returns
 */
const InvoiceTable = ({
  items,
  setPopup,
}: {
  items: InvoiceRowData[] | undefined;
  setPopup: Dispatch<
    SetStateAction<TablePopup<InvoiceRowData, InvoicePopupTypes>>
  >;
}) => {
  return (
    <div className="mx-6 overflow-x-auto rounded-xl border border-gray-600 drop-shadow-lg">
      <table className="w-full table-fixed text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-slate-800 text-sm uppercase text-gray-300">
          <tr>
            <th className="w-[200px] px-6 py-3 lg:w-1/6">User</th>
            <th className="w-[200px] px-6 py-3 lg:w-1/6">Total</th>
            <th className="w-[200px] px-6 py-3 lg:w-1/6">Balance</th>
            <th className="w-[125px] px-6 py-3">Due Date</th>
            <th className="w-[220px] px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((invoice, i) => (
            <InvoiceTableRow key={i} item={invoice} setPopup={setPopup} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Invoice page.
 * @returns
 */
const InvoicePage = () => {
  const [page, setPage] = useState<number>(0);
  const [limit] = useState<number>(10);
  const [popup, setPopup] = useState<
    TablePopup<InvoiceRowData, InvoicePopupTypes>
  >({
    show: false,
  });

  const { data, refetch, fetchNextPage } = api.invoice.getAll.useInfiniteQuery(
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

  const invoicesLength = data?.pages[page]?.count;
  const invoices = data?.pages[page]?.items;

  return (
    <main className="mx-auto mb-4 max-w-[1400px]">
      <div className="m-6 gap-4 space-y-2">
        <div className="flex items-center justify-between">
          <TablePageHeader label="Invoices" count={invoicesLength} />
          <div>
            <AddButton
              label="Invoice"
              onClick={() => setPopup({ show: true, type: "create" })}
            />
          </div>
        </div>
      </div>

      {/* popup */}
      {popup.show && (
        <InvoicePopup
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
        items={invoices}
      />

      {/* main table */}
      <InvoiceTable items={invoices} setPopup={setPopup} />
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

export default InvoicePage;
