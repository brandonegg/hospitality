import type { Role } from "@prisma/client";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";

import { CreateReportForm } from "../../components/reports/create";

interface CreateReportPageProps {
  user: Session["user"];
}

/**
 * Create report page
 * @returns
 */
const CreateReportPage = () => {
  return (
    <div className="mx-auto max-w-xl">
      <CreateReportForm />
    </div>
  );
};

/**
 * Server side page setup
 * @param context
 * @returns
 */
export const getServerSideProps: GetServerSideProps<
  CreateReportPageProps
> = async (context: GetServerSidePropsContext) => {
  // Get the user session
  const session = await getSession(context);

  if (!session?.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Patients view reports, doctors write reports. No one else should have access
  const allowedUsers: Role[] = ["DOCTOR"];
  if (!allowedUsers.includes(session.user.role)) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  // If the user is authenticated, continue with rendering the page
  return {
    props: {
      user: session.user,
    },
  };
};

export default CreateReportPage;
