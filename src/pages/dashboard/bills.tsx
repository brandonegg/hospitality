import { ChevronRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

import Layout from "../../components/dashboard/layout";

interface MockBillableItem {
  id: string;
  label: string;
  description: string;
  cost: string;
}

interface MockLineItem {
  itemId: MockBillableItem["id"];
  quantity: number;
}

interface MockInvoice {
  id: string;
  due: Date;
  totalDue: string;
  remainingBalance: string;
  items: MockLineItem[];
  notes: string;
}

/**
 * Bill summary view button
 */
const BillSummaryButton = ({ details }: { details: MockInvoice }) => {
  return (
    <Link
      href="/dashboard/bills"
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
            <span className="text-neutral-600">{details.remainingBalance}</span>
          </h2>
        </div>
        <div className="px-4">
          <h1 className="inline-block text-lg font-semibold">Amount Due By</h1>
          <h2 className="italic text-neutral-600">
            {details.due.toDateString()}
          </h2>
        </div>
      </div>
      <ChevronRightIcon className="my-auto h-8 grow-0 group-hover:animate-bounce_x" />
    </Link>
  );
};

const mockData: MockInvoice[] = [
  {
    id: "mock-invoice",
    due: new Date(),
    totalDue: "100.00",
    remainingBalance: "50.00",
    items: [],
    notes: "Patient Checkup",
  },
];

/**
 * Wrapper for the different bills sections display on page (upcomming/paid etc.)
 */
const BillsSection = ({
  label,
  bills,
}: {
  label: string;
  bills: MockInvoice[];
}) => {
  return (
    <section className="grow-0 px-8">
      <h1 className="text-center text-xl font-bold text-sky-900">{label}</h1>
      <div className="mt-4 flex flex-row">
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
const BillsDashboardPage = () => {
  return (
    <Layout>
      <div className="mx-auto flex w-full flex-col justify-center divide-x md:flex-row">
        <BillsSection label="Upcomming Bills" bills={mockData} />
        <BillsSection label="Paid Bills" bills={mockData} />
      </div>
    </Layout>
  );
};

export default BillsDashboardPage;
