import { ChevronRightIcon } from "@heroicons/react/24/solid";
import Image from 'next/image';
import Link from "next/link";

import Layout from "../../components/dashboard/layout";

interface MockBillableItem {
    id: string,
    label: string,
    description: string,
    cost: string,
}

interface MockLineItem {
    itemId: MockBillableItem['id'],
    quantity: number,
}

interface MockInvoice {
    id: string,
    due: Date,
    totalDue: string,
    remainingBalance: string,
    items: MockLineItem[],
    notes: string,
}

/**
 * Bill summary view button
 */
const BillSummaryButton = ({details} : {
    details: MockInvoice,
}) => {
    return (
        <Link href="/dashboard/bills" className="group transition duration-100 p-4 bg-neutral-100 drop-shadow-lg hover:drop-shadow-none rounded-xl border border-neutral-300 flex flex-row space-x-6">
            <div className='grow-0 bg-yellow-200 p-2 rounded-xl border border-neutral-900 my-auto drop-shadow'>
                <Image alt="receipt" src="/receipt-logo.svg" width={36} height={36}/>
            </div>
            <div className="grow flex flex-row divide-x divide-neutral-700">
                <div className="px-4">
                    <h1 className='inline-block font-semibold text-lg'>Remaining Balance</h1>
                    <h2><span className="text-green-700">$</span>{details.remainingBalance}</h2>
                </div>
                <div className="px-4">
                    <h1 className='inline-block font-semibold text-lg'>Amount Due By</h1>
                    <h2 className="italic text-neutral-600">{details.due.toDateString()}</h2>
                </div>
            </div>
            <ChevronRightIcon className="grow-0 h-8 my-auto group-hover:animate-bounce_x" />
        </Link>
    );
};

const mockData: MockInvoice[] = [
    {
        id: 'mock-invoice',
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
const BillsSection = ({label, bills}: {
    label: string,
    bills: MockInvoice[],
}) => {
    return (
        <section className="px-8 grow-0">
            <h1 className="text-xl font-bold text-center text-sky-900">{label}</h1>
            <div className="flex flex-row mt-4">
                {bills.map((bill, index) => {
                    return (
                        <BillSummaryButton key={index} details={bill} />
                    );
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
            <div className="mx-auto w-full flex flex-col justify-center md:flex-row divide-x">
                <BillsSection label="Upcomming Bills" bills={mockData} />
                <BillsSection label="Paid Bills" bills={mockData} />
            </div>
        </Layout>
    );
};

export default BillsDashboardPage;
