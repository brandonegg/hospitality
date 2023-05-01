import { Role } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface DashBoardNavButtonProperties {
  href: string;
  label: string;
  selected?: boolean;
  requireRole?: Role[];
}

/**
 * Note: when requireRole is undefined, all roles can access.
 */
const dashboardNavLinks: DashBoardNavButtonProperties[] = [
  {
    label: "Overview",
    href: "/dashboard",
  },
  {
    label: "Make Appointments",
    href: "/appointment",
    requireRole: [Role.PATIENT],
  },
  {
    label: "View Appointments",
    href: "/myAppointments",
    requireRole: [Role.PATIENT],
  },
  {
    label: "Set Hours",
    href: "/adminHourSetting",
    requireRole: [Role.ADMIN],
  },
  {
    label: "Set Availability",
    href: "/availability",
    requireRole: [Role.DOCTOR],
  },
  {
    label: "View Availability",
    href: "/myAvailabilities",
    requireRole: [Role.DOCTOR],
  },
  {
    label: "Pay Bills",
    href: "/dashboard/bills",
    requireRole: [Role.PATIENT],
  },
  {
    label: "View Prescriptions",
    href: "/dashboard/prescription",
    requireRole: [Role.PATIENT],
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    requireRole: [Role.PATIENT, Role.DOCTOR],
  },
];

/**
 * Dashboard nav button component. Shown below the main nav bar
 * @param param0
 */
const DashBoardNavButton = ({
  href,
  label,
  selected,
}: DashBoardNavButtonProperties) => {
  if (selected) {
    return (
      <>
        <div className="box-content h-full rounded-t-lg border-x-[1px] border-t-[1px] border-gray-400 bg-gray-200 px-3">
          <div className="grid h-full w-full place-content-center text-center">
            <span className="text-lg">{label}</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Link
        href={href}
        className="box-content h-full rounded-t-lg border-x-[1px] border-t-[1px] border-transparent px-3 hover:border-gray-400 hover:bg-gray-200"
      >
        <div className="grid h-full w-full place-content-center text-center">
          <span className="text-lg">{label}</span>
        </div>
      </Link>
    </>
  );
};

/**
 * Nav bar button component for the quick access drop down.
 * @param param0
 */
const DashBoardQuickAccessNavButton = ({
  href,
  label,
  selected,
}: DashBoardNavButtonProperties) => {
  if (selected) {
    return (
      <li>
        <span className="block w-full bg-gray-500 py-1 text-lg text-gray-200">
          {label}
        </span>
      </li>
    );
  }

  return (
    <li>
      <Link href={href}>
        <span className="block w-full py-1 text-lg text-gray-200 hover:bg-gray-500">
          {label}
        </span>
      </Link>
    </li>
  );
};

/**
 * Dashboard navbar component.
 */
const DashboardNavBar = ({}) => {
  const router = useRouter();
  const session = useSession();
  const [quickAccessOpened, setQuickAccessOpened] = useState<boolean>(false);

  if (!session.data?.user) {
    return <></>;
  }

  const user = session.data.user;

  /**
   * Event handler for the quick access toggle button.
   */
  const handleQuickAccessTogle = () => {
    setQuickAccessOpened(!quickAccessOpened);
  };

  const dashboardTopNavButtons = dashboardNavLinks.map((linkDetails, index) => {
    if (
      !linkDetails.requireRole ||
      linkDetails.requireRole.includes(user.role) ||
      linkDetails.requireRole.length == 0
    ) {
      const isOpen = router.asPath === linkDetails.href;

      return (
        <DashBoardNavButton key={index} selected={isOpen} {...linkDetails} />
      );
    }
  });

  const dashboardDropdownNavButtons = dashboardNavLinks.map(
    (linkDetails, index) => {
      if (
        !linkDetails.requireRole ||
        linkDetails.requireRole.includes(user.role) ||
        linkDetails.requireRole.length == 0
      ) {
        const isOpen = router.asPath === linkDetails.href;

        return (
          <DashBoardQuickAccessNavButton
            key={index}
            selected={isOpen}
            {...linkDetails}
          />
        );
      }
    }
  );

  return (
    <div className="flex justify-between">
      <span className="hidden lg:inline">
        <h2 className="hidden text-3xl font-bold md:inline">
          Welcome, {user.name}
        </h2>
      </span>
      <span className="lg:hidden">
        <h2 className="hidden text-3xl font-bold md:inline">Welcome!</h2>
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
  );
};

export { DashBoardNavButton, DashBoardQuickAccessNavButton, DashboardNavBar };
export type { DashBoardNavButtonProperties };
