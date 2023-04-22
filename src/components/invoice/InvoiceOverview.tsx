import type { Session } from "next-auth";

import type { RouterOutputs } from "../../utils/api";

type InvoiceDetails = RouterOutputs["invoice"]["getAllUserInvoices"][number];

/**
 * Pay invoice section of the invoice overview.
 */
const PayInvoice = ({
  user,
  invoice,
}: {
  user: Session["user"];
  invoice: InvoiceDetails;
}) => {
  return (
    <div className="flex flex-col rounded-xl border border-neutral-400 bg-neutral-200 p-2 drop-shadow-xl">
      <h1 className="text-center text-xl font-bold">Make Payment</h1>
    </div>
  );
};

/**
 * Individual line item display for the invoice summary.
 */
const InvoiceLineItem = ({
  item,
}: {
  item: InvoiceDetails["items"][number];
}) => {
  return (
    <div className="flex w-80 flex-row justify-between px-2">
      <section className="space-x-2">
        <span className="inline-block">{item.rate?.name}</span>
        <span className="text-sm italic text-neutral-500">{`($${
          item.rate?.price ?? ""
        } x ${item.quantity})`}</span>
      </section>
      <span>${item.total}</span>
    </div>
  );
};

/**
 * Invoice summary view, meant to resemble a receipt
 */
const InvoiceSummary = ({ invoice }: { invoice: InvoiceDetails }) => {
  return (
    <div className="rounded-xl border border-neutral-200 bg-yellow-200 p-2 drop-shadow-xl">
      <h1 className="mb-2 text-center text-lg font-bold">Invoice Summary</h1>
      <div className="mb-2 flex flex-col divide-y divide-dotted divide-neutral-400">
        {invoice.items.map((item, index) => {
          return <InvoiceLineItem key={index} item={item} />;
        })}
      </div>
      <div className="flex flex-row justify-between border-t border-neutral-900 p-2">
        <span className="font-bold">Total</span>
        <span>${invoice.total}</span>
      </div>
    </div>
  );
};

/**
 * Main invoice overview component displayed on /invoice/[id]
 */
const InvoiceOverview = ({
  invoice,
  user,
}: {
  invoice: InvoiceDetails;
  user: Session["user"];
}) => {
  return (
    <div className="mx-auto flex max-w-2xl flex-row space-x-8">
      <PayInvoice user={user} invoice={invoice} />
      <InvoiceSummary invoice={invoice} />
    </div>
  );
};

export { InvoiceOverview };
