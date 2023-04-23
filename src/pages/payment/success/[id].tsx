import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

import { prisma } from "../../../server/db";
import { api } from "../../../utils/api";

const redirectToError = {
  redirect: {
    destination: "/payment/error",
    permanent: false,
  },
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

  const paymentId = context.params?.id?.toString();
  if (!paymentId) {
    return redirectToError;
  }

  const invoice = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
  });

  if (!invoice) {
    return redirectToError;
  }

  return {
    props: {
      user: session.user,
      paymentId: paymentId,
    },
  };
};

/**
 * Single invoice page
 */
const PaymentSuccessPage = ({ paymentId }: { paymentId: string }) => {
  return (
    <div className="grid place-items-center">
      <div className="flex flex-col text-center">
        <h1 className="text-3xl font-bold text-green-600">Payment Success!</h1>
        <p>
          {"Payment ID: "}
          <span className="italic text-neutral-600">{paymentId}</span>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
