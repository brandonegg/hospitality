import type { GetServerSidePropsContext } from "next/types";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";

import Alert from "../../components/Alert";
import { api } from "../../lib/api";

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
      reportId: context.params?.id?.toString(),
    },
  };
};

/**
 * Single invoice page
 */
const PostVisitReportPage = ({
  user,
  reportId,
}: {
  user: Session["user"];
  reportId: string | undefined;
}) => {
  const { data, error } = api.visitReport.get.useQuery(
    { id: reportId ?? "" },
    {
      retry: (failureCount, error) => {
        const validErrors = ["BAD_REQUEST", "UNAUTHORIZED"];
        if (validErrors.includes(error.data?.code ?? "")) {
          return false;
        }

        return failureCount < 3;
      },
    }
  );

  if (error) {
    return (
      <div className="mx-auto max-w-2xl">
        <Alert type="error">{error.message}</Alert>
      </div>
    );
  }

  if (!data) {
    return <div></div>;
  }

  return <div></div>;
};

export default PostVisitReportPage;
