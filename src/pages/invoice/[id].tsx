import type { GetServerSidePropsContext } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";

import { InvoiceOverview } from "../../components/invoice/InvoiceOverview";
import { api } from "../../utils/api";

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

  return {
    props: {
      user: session.user,
      invoiceId: context.params?.id?.toString(),
    },
  };
};

/**
 * Single invoice page
 */
const InvoiceViewPage = ({
  user,
  invoiceId,
}: {
  user: Session["user"];
  invoiceId: string | undefined;
}) => {
  const { data: invoice } = api.invoice.byId.useQuery({
    id: invoiceId ?? "",
  });

  if (invoice === null) {
    return <p>No invoice found with this ID</p>;
  }

  if (!invoice) {
    return <div></div>;
  }

  return (
    <div className="mx-auto">
      <InvoiceOverview invoice={invoice} user={user} />
    </div>
  );
};

export default InvoiceViewPage;
