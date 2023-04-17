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
        <div>
            test
        </div>
    );
};

const mockData: MockInvoice[] = [
    {
        due: new Date(),
        totalDue: "100.00",
        remainingBalance: "50.00",
        items: [],
        notes: "Patient Checkup",
    },
];

/**
 * Main bills page. Will only show bills tied to the user.
 */
const BillsDashboardPage = () => {
    return (
        <Layout>
            <div className="mx-auto max-w-2xl flex flex-col md:flex-row divide-x">
                <div className="px-4 grow-0">
                    <h1 className="text-2xl font-bold">Upcomming Bills</h1>
                    <div className="flex flex-row">
                        <BillSummaryButton details={mockData[0] as MockInvoice} />
                    </div>
                </div>
                <div className="grow-0">
                    <h1 className="text-2xl font-bold">Paid Bills</h1>
                    <div className="flex flex-row">
                        <BillSummaryButton details={mockData[0] as MockInvoice} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default BillsDashboardPage;
