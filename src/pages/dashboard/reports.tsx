import type { Role } from "@prisma/client";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";

import { DoctorReportDashboard } from "../../components/reports/doctor";
import { PatientReportDashboard } from "../../components/reports/patient";

interface ReportPageProps {
  user: Session["user"];
}

/**
 * Report dashboard page
 */
const DashboardReportsPage = ({ user }: ReportPageProps) => {
  if (["DOCTOR"].includes(user.role)) {
    return <DoctorReportDashboard />;
  }

  return <PatientReportDashboard />;
};

/**
 * Server side page setup
 * @param context
 * @returns
 */
export const getServerSideProps: GetServerSideProps<ReportPageProps> = async (
  context: GetServerSidePropsContext
) => {
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
  const allowedUsers: Role[] = ["DOCTOR", "PATIENT"];
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

export default DashboardReportsPage;
