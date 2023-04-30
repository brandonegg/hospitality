import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { Role } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";

import Layout from "../../components/dashboard/layout";
import type { RouterOutputs } from "../../lib/api";
import { api } from "../../lib/api";

type InvoiceResponseData =
  RouterOutputs["invoice"]["getAllUserInvoices"][number];

/**
 * Bill summary view button
 */
const BillSummaryButton = ({ details }: { details: InvoiceResponseData }) => {
  return (
    <Link
      href={`/invoice/${details.id}`}
      className="group flex flex-row space-x-6 rounded-xl border border-neutral-300 bg-neutral-100 p-4 drop-shadow-lg transition duration-100 hover:drop-shadow-none"
    >
      <div className="my-auto grow-0 rounded-xl border border-neutral-900 bg-yellow-200 p-2 drop-shadow">
        <Image alt="receipt" src="/receipt-logo.svg" width={36} height={36} />
      </div>
      <div className="flex grow flex-row divide-x divide-neutral-700">
        <div className="px-4">
          <h1 className="inline-block text-lg font-semibold">
            Remaining Balance
          </h1>
          <h2>
            <span className="text-green-700">$</span>
            <span className="text-neutral-600">{details.totalDue}</span>
          </h2>
        </div>
        <div className="px-4">
          <h1 className="inline-block text-lg font-semibold">Amount Due By</h1>
          <h2 className="italic text-neutral-600">
            {new Date(
              details.paymentDue.getTime() -
                details.paymentDue.getTimezoneOffset() * -60000
            )
              .toISOString()
              .slice(0, 10)}
          </h2>
        </div>
      </div>
      <ChevronRightIcon className="my-auto h-8 grow-0 group-hover:animate-bounce_x" />
    </Link>
  );
};

/**
 * Wrapper for the different bills sections display on page (upcoming/paid etc.)
 */
const BillsSection = ({
  label,
  bills,
}: {
  id?: string;
  label: string;
  bills: InvoiceResponseData[];
}) => {
  return (
    <section id="upcoming-bills" className="grow-0 px-8">
      <h1 className="text-center text-xl font-bold text-sky-900">{label}</h1>
      <div className="mt-4 flex flex-col space-y-6">
        {bills.map((bill, index) => {
          return <BillSummaryButton key={index} details={bill} />;
        })}
      </div>
    </section>
  );
};

/**
 * Main bills page. Will only show bills tied to the user.
 */
const BillsDashboardPage = ({ user }: { user: Session["user"] }) => {
  const { data: userInvoices } = api.invoice.getAllUserInvoices.useQuery({
    userId: user.id,
  });

  const upcomingInvoices = userInvoices?.filter(
    (item) => parseFloat(item.totalDue) > 0
  );

  const paidInvoices = userInvoices?.filter(
    (item) => parseFloat(item.totalDue) == 0
  );

  return (
    <Layout>
      <div className="mx-auto flex w-full flex-col justify-center divide-x md:flex-row">
        {upcomingInvoices && upcomingInvoices.length !== 0 ? (
          <BillsSection label="Upcoming Bills" bills={upcomingInvoices} />
        ) : undefined}
        {paidInvoices && paidInvoices.length !== 0 ? (
          <BillsSection label="Paid Bills" bills={paidInvoices} />
        ) : undefined}
      </div>
    </Layout>
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

  const authorizedUsers: Role[] = [Role.PATIENT];

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

export default BillsDashboardPage;
