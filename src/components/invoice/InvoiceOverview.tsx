import type { Session } from "next-auth";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { RouterInputs, RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import ErrorMessage from "../ErrorMessage";

type InvoiceDetails = RouterOutputs["invoice"]["getAllUserInvoices"][number];
type PaymentCreateInput = RouterInputs["payment"]["create"];
type PaymentCreateOutput = RouterOutputs["payment"]["create"];

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
    <div className="flex grow flex-col space-y-4 rounded-xl border border-neutral-400 bg-neutral-200 p-2 drop-shadow-xl">
      <h1 className="text-center text-xl font-bold">Make Payment</h1>
      <PaymentForm user={user} invoice={invoice} />
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
    <div className="h-fit rounded-xl border border-neutral-400 bg-yellow-200 p-2 drop-shadow-xl">
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
 * Payment Form component
 */
const PaymentForm = ({
  invoice,
  user,
}: {
  invoice: InvoiceDetails;
  user: Session["user"];
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentCreateInput>({
    defaultValues: {
      invoiceId: invoice.id,
      userId: user.id,
    },
  });
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const { mutate } = api.payment.create.useMutation({
    onSuccess: (data: PaymentCreateOutput) => {
      // TODO: Redirect to payment success page
    },
    onError: (error) => setServerError(error.message),
  });

  /**
   * Form submit handler.
   */
  const onSubmit: SubmitHandler<PaymentCreateInput> = (data) => {
    mutate(data);
  };

  const { data: paymentSources } = api.payment.getSources.useQuery();

  return (
    <form className="flex flex-row" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-grow flex-col space-y-4">
        {/** Payment source input */}
        <section className="flex flex-col">
          <label htmlFor="sourceId" className="font-semibold text-neutral-500">
            Payment Source
          </label>
          <select
            id="sourceId"
            className="rounded border border-gray-300 p-2"
            {...register("sourceId", {
              required: "Source ID is required",
            })}
          >
            {paymentSources
              ? paymentSources.map((paymentSource, index) => (
                  <option key={index} value={paymentSource.id}>
                    {paymentSource.name}
                  </option>
                ))
              : undefined}
          </select>
          {errors.userId && (
            <ErrorMessage id="source-error">
              {errors.sourceId?.message}
            </ErrorMessage>
          )}
        </section>

        {/** Payment source input */}
        <section className="flex flex-col">
          <label htmlFor="amount" className="font-semibold text-neutral-500">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            className="rounded border border-gray-300 p-2"
            {...register("amount", {
              required: "Payment amount is required",
            })}
          />
          {errors.userId && (
            <ErrorMessage id="source-error">
              {errors.sourceId?.message}
            </ErrorMessage>
          )}
        </section>

        {/** Errors show here */}
        {serverError ? (
          <p className="italic text-red-500">{serverError}</p>
        ) : undefined}

        <button
          type="submit"
          className="w-full rounded-lg border border-neutral-800 bg-blue-100 p-2 hover:bg-blue-400"
        >
          Pay
        </button>
      </div>
    </form>
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
