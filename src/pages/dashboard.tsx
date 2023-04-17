/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { DocumentCheckIcon } from "@heroicons/react/24/solid";
import type { Appointment } from "@prisma/client";
import type { GetServerSideProps, GetServerSidePropsContext } from "next/types";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

import MainHeader from "../components/Header";
import type { DashBoardNavButtonProperties } from "../components/dashboard/Navigation";
import {
  DashBoardNavButton,
  DashBoardQuickAccessNavButton,
} from "../components/dashboard/Navigation";
import VitalsWidget from "../components/dashboard/Vitals";
import { timeSort } from "../pages/appointment";
import { api } from "../utils/api";

interface DashboardPageProps {
  user: Session["user"];
}

interface SquareWidgetProperties {
  title?: string;
  width: 1 | 2; // Width of the widget relative to grid cells.
  children: JSX.Element;
}

/**
 * A square widget element for displaying useful information in the dashboard
 * @param param0
 * @returns
 */
const SquareWidget = ({ title, width, children }: SquareWidgetProperties) => {
  /**
   * Widget title generation
   * @returns
   */
  const Title = () => {
    if (!title) {
      return <></>;
    }
    return (
      <>
        <div className="bg-slate-800 text-gray-300">
          <div className="p-1">
            <h1 className="text-center text-lg font-bold">{title}</h1>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className={width == 2 ? "col-span-2" : "col-span-1"}>
        <div className="overflow-hidden rounded-xl border border-gray-600 drop-shadow-lg">
          <Title />
          {children}
        </div>
      </div>
    </>
  );
};

const dashboardNavLinks: DashBoardNavButtonProperties[] = [
  {
    selected: true,
    label: "Overview",
    href: "/",
  },
  {
    label: "Make Appointments",
    href: "/appointment",
  },
  {
    label: "View Appointments",
    href: "/myAppointments",
  },
  {
    label: "Documents",
    href: "/",
  },
  {
    label: "Refills",
    href: "/",
  },
  {
    label: "Profile",
    href: "/",
  },
];

/**
 * User dashboard page
 * @returns
 */
const Dashboard = ({ user }: DashboardPageProps) => {
  const [quickAccessOpened, setQuickAccessOpened] = useState<boolean>(false);
  const [updatedDashboardNavLinks, setNavLinks] = useState(
    [] as DashBoardNavButtonProperties[]
  );

  useEffect(() => {
    console.log(user.role);
    if (user.role === "DOCTOR") {
      // doctors can't make appointments, and patients can't make availabilitys
      dashboardNavLinks[1] = {
        label: "Set Availability",
        href: "/availability",
      };
      dashboardNavLinks[2] = {
        label: "View Availability",
        href: "/myAvailabilities",
      };
    }
    if (user.role === "ADMIN") {
      // admins can't make appointments, and patients can't make availabilitys
      dashboardNavLinks[1] = {
        label: "Set Hours",
        href: "/adminHourSetting",
      };
      dashboardNavLinks.splice(2, 1);
    }
    console.log(dashboardNavLinks);
    setNavLinks(dashboardNavLinks);
  }, [user]);

  /**
   * Event handler for the quick access toggle button.
   */
  const handleQuickAccessTogle = () => {
    setQuickAccessOpened(!quickAccessOpened);
  };

  const dashboardTopNavButtons = updatedDashboardNavLinks.map(
    (linkDetails, index) => {
      return <DashBoardNavButton key={index} {...linkDetails} />;
    }
  );

  const dashboardDropdownNavButtons = updatedDashboardNavLinks.map(
    (linkDetails, index) => {
      return <DashBoardQuickAccessNavButton key={index} {...linkDetails} />;
    }
  );

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

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }
  return (
    <>
      <main className="mx-auto max-w-[1400px]">
        <MainHeader user={user} />
        <div className="m-6 gap-4">
          <section className="m-4 border-b-2 px-2 sm:m-8">
            <div className="flex justify-between">
              <span className="hidden lg:inline">
                <h2 className="hidden text-3xl font-bold md:inline">
                  Welcome, {user.name}
                </h2>
              </span>
              <span className="lg:hidden">
                <h2 className="hidden text-3xl font-bold md:inline">
                  Welcome!
                </h2>
              </span>
              <div className="mx-auto hidden sm:flex md:m-0">
                {dashboardTopNavButtons}
              </div>
              <div className="mb-2 w-full sm:hidden">
                <button
                  onClick={handleQuickAccessTogle}
                  className="text-md w-full rounded-lg border-2 border-slate-900 bg-slate-200 py-2 font-semibold"
                >
                  Quick Access ▼
                </button>
                <div
                  className={
                    "mx-2 rounded-b-lg bg-gray-800 p-2" +
                    (quickAccessOpened ? "" : " hidden")
                  }
                >
                  <ul className="divide-y divide-gray-300">
                    {dashboardDropdownNavButtons}
                  </ul>
                </div>
              </div>
            </div>
          </section>

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
                <VitalsWidget />
              </SquareWidget>
            </div>
          </div>
        </div>
      </main>
    </>
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
