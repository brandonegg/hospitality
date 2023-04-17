import { Role } from "@prisma/client";
import Link from "next/link";
import type { Session } from "next-auth";
import { useState } from "react";

interface DashBoardNavButtonProperties {
    href: string;
    label: string;
    selected?: boolean;
    requireRole?: Role[],
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
];

/**
 * Dashboard nav button component. Shown below the main nav bar
 * @param param0
 */
const DashBoardNavButton = ({href, label, selected}: DashBoardNavButtonProperties) => {
    if (selected) {
        return <>
            <div className="box-content rounded-t-lg bg-gray-200 border-x-[1px] border-t-[1px] border-gray-400 h-full px-3">
                <div className="grid place-content-center h-full w-full text-center">
                    <span className="text-lg">{label}</span>
                </div>
            </div>
        </>;
    }

    return <>
        <Link href={href} className="box-content rounded-t-lg hover:bg-gray-200 border-x-[1px] border-t-[1px] border-transparent hover:border-gray-400 h-full px-3">
            <div className="grid place-content-center h-full w-full text-center">
                <span className="text-lg">{label}</span>
            </div>
        </Link>
    </>;
};

/**
 * Nav bar button component for the quick access drop down.
 * @param param0
 */
const DashBoardQuickAccessNavButton = ({href, label, selected}: DashBoardNavButtonProperties) => {
    if (selected) {
        return (
            <li>
                <span className="text-lg bg-gray-500 py-1 block w-full text-gray-200">{label}</span>
            </li>
        );
    }

    return (
        <li>
            <Link href={href}>
                <span className="text-lg hover:bg-gray-500 py-1 block w-full text-gray-200">{label}</span>
            </Link>
        </li>
    );
};

/**
 * Dashboard navbar component.
 */
const DashboardNavBar = ({user}: {
    user: Session['user'],
}) => {
    const [quickAccessOpened, setQuickAccessOpened] = useState<boolean>(false);

    /**
     * Event handler for the quick access toggle button.
     */
    const handleQuickAccessTogle = () => {
        setQuickAccessOpened(!quickAccessOpened);
    };

    const dashboardTopNavButtons = dashboardNavLinks.map((linkDetails, index) => {
        if (!linkDetails.requireRole || linkDetails.requireRole.includes(user.role) || linkDetails.requireRole.length == 0) {
            return (
                <DashBoardNavButton key={index} {...linkDetails}/>
            );
        }
    });

    const dashboardDropdownNavButtons = dashboardNavLinks.map((linkDetails, index) => {
        if (!linkDetails.requireRole || linkDetails.requireRole.includes(user.role) || linkDetails.requireRole.length == 0) {
            return (
                <DashBoardQuickAccessNavButton key={index} {...linkDetails}/>
            );
        }
    });

    return (
        <div className="flex justify-between">
            <span className="hidden lg:inline">
                <h2 className="hidden md:inline font-bold text-3xl">Welcome, {user.name}</h2>
            </span>
            <span className="lg:hidden">
                <h2 className="hidden md:inline font-bold text-3xl">Welcome!</h2>
            </span>
            <div className="hidden sm:flex mx-auto md:m-0">
                {dashboardTopNavButtons}
            </div>
            <div className="w-full sm:hidden mb-2">
                <button onClick={handleQuickAccessTogle} className="text-md font-semibold border-2 border-slate-900 bg-slate-200 w-full py-2 rounded-lg">
                    Quick Access ▼
                </button>
                <div className={"mx-2 p-2 bg-gray-800 rounded-b-lg" + (quickAccessOpened ? "" : " hidden")}>
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
