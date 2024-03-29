import { DocumentCheckIcon } from "@heroicons/react/24/solid";
import type { Appointment } from "@prisma/client";
import type { GetServerSideProps, GetServerSidePropsContext } from "next/types";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";

import Layout from "../../components/dashboard/layout";
import { SquareWidget } from "../../components/dashboard/widget";
import { VitalsWidget } from "../../components/vitals";
import { api } from "../../lib/api";
import { timeSort } from "../appointment";

interface DashboardPageProps {
  user: Session["user"];
}

/**
 * User dashboard page
 * @returns
 */
const Dashboard = ({ user }: DashboardPageProps) => {
  const { data: recentVitals } = api.vitals.getMostRecent.useQuery();

  //appointment stuff
  let appoints: Appointment[] = [];
  if (user.role === "DOCTOR") {
    const { data } = api.getAppoint.getDocAppoint.useQuery({
      docId: user.id,
      weekCount: 0,
    });
    // || [] so sort doesn't break when data is undefined
    appoints = (data as Appointment[]) || [];
    appoints.sort(timeSort);
    appoints.length = 5; // only show the first 5 appointments
  }
  if (user.role === "PATIENT") {
    const { data } = api.getAppoint.getPatientAppoint.useQuery({
      userId: user.id,
      weekCount: 0,
    });
    appoints = (data as Appointment[]) || [];
    appoints.sort(timeSort);
    appoints.length = 5; // only show first 5 appointments
  }

  return (
    <Layout>
      <div className="m-6 gap-4">
        <div className="sm:m-8">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <SquareWidget title="Upcoming Appointments" width={2}>
              <div className="h-full bg-yellow-100 p-2">
                {appoints?.map((appoint, index) => (
                  <p key={index} className="italic">
                    {new Date(
                      appoint.date.getTime() -
                        appoint.date.getTimezoneOffset() * -60000
                    ).toDateString()}{" "}
                    from {appoint.startTime}-{appoint.endTime}
                  </p>
                ))}
              </div>
            </SquareWidget>
            <SquareWidget width={1} title="Insurance">
              <div className="w-full">
                <div className="h-full bg-slate-100 p-2">
                  <p className="pt-1 italic">Everything is up-to-date!</p>
                  <DocumentCheckIcon className="mx-auto my-auto mt-2 w-8 text-center text-green-700" />
                </div>
              </div>
            </SquareWidget>
            <SquareWidget width={2} title="Vitals">
              {recentVitals ? (
                <VitalsWidget vitals={recentVitals} />
              ) : (
                <div className="grid h-32 place-items-center bg-slate-100">
                  <span className="text-xl">No past vitals records</span>
                </div>
              )}
            </SquareWidget>
          </div>
        </div>
      </div>
    </Layout>
  );
};

/**
 * Server side page setup
 * @param context
 * @returns
 */
export const getServerSideProps: GetServerSideProps<
  DashboardPageProps
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

  // If the user is authenticated, continue with rendering the page
  return {
    props: {
      user: session.user,
    },
  };
};

export default Dashboard;
