/**
 * Navigation bar component displayed at the top of page for convenience navigating to various site resources and pages
 */
import { Bars3Icon, HomeIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { Role } from "@prisma/client";
import Link from "next/link";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import type { ReactNode } from "react";

/**
 * Add links for the navigation bar to this object.
 */
const PagesConfig: NavLinkProps[] = [
  {
    label: <HomeIcon className="h-6 w-6" />,
    href: "/",
    requiresAccount: false,
    allowRoles: [],
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    requiresAccount: true,
    allowRoles: [],
  },
  {
    label: "Users",
    href: "/users",
    requiresAccount: true,
    allowRoles: [Role.ADMIN],
  },
  {
    label: "Beds",
    href: "/beds",
    requiresAccount: true,
    allowRoles: [Role.ADMIN, Role.DOCTOR, Role.NURSE],
  },
  {
    label: "Rates",
    href: "/rates",
    requiresAccount: true,
    allowRoles: [Role.ADMIN],
  },
  {
    label: "Invoices",
    href: "/invoice",
    requiresAccount: true,
    allowRoles: [Role.ADMIN],
  },
  {
    label: "Tests",
    href: "/tests",
    requiresAccount: true,
    allowRoles: [Role.ADMIN],
  },
  {
    label: "Lab Tests",
    href: "/lab-tests",
    requiresAccount: true,
    allowRoles: [Role.DOCTOR, Role.NURSE],
  },
  {
    label: "Support",
    href: "/support",
    requiresAccount: false,
    allowRoles: [],
  },
];

interface NavLinkProps {
  label: string | ReactNode;
  href: string;
  requiresAccount: boolean;
  allowRoles: string[];
}

interface NavBarProps {
  user?: Session["user"];
}

/**
 * Navigation bar component
 *
 * @param props Provide logged in user data is user signed into session
 * @returns
 */
const NavigationBar = ({ user }: NavBarProps) => {
  /**
   * Singular navigation bar link component.
   * @param props Properties of nav link element to represent as component
   */
  const NavigationLink = ({
    href,
    label,
    requiresAccount,
    allowRoles,
  }: NavLinkProps) => {
    const hidden = requiresAccount && !user;

    if (allowRoles.length > 0) {
      if (!user || !allowRoles.includes(user.role)) {
        return <></>;
      }
    }

    return (
      <>
        <div className="hover:bg-gray-700">
          <Link href={href}>
            <div
              className={
                "text-md px-3 py-4 font-medium text-white hover:bg-gray-700" +
                (hidden ? " hidden" : "")
              }
            >
              {label}
            </div>
          </Link>
        </div>
      </>
    );
  };

  /**
   * Renders the component for sign in/sign up or user credentials if user signed in
   * @param props
   */
  const AccountInfo = ({}) => {
    /**
     * Renders login/signup info, or account info depending on session
     * @param props
     * @returns
     */
    const SessionView = ({}) => {
      return user ? (
        <>
          <div className="group relative mr-2 block h-full rounded-lg p-2 hover:bg-gray-700">
            <UserCircleIcon className="h-7 w-7 text-white" />
            <div className="absolute right-0 z-50 mt-2 hidden rounded-md border border-slate-600 bg-white drop-shadow-xl group-hover:block">
              <div className="flex flex-col">
                <button
                  onClick={async () => {
                    await signOut();
                  }}
                >
                  <p className="text-md w-24 bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700">
                    Sign out
                  </p>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="group relative mr-2 block h-full rounded-lg p-2 hover:bg-gray-700 sm:hidden">
            <Bars3Icon className="h-6 w-6 text-white" />
            <div className="absolute right-0 z-50 mt-2 hidden rounded-md border border-slate-600 bg-white drop-shadow-xl group-hover:block">
              <div className="flex flex-col">
                <Link href="/login">
                  <p className="text-md w-24 bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700">
                    Login
                  </p>
                </Link>
                <Link href="/signup">
                  <p className="text-md w-24 bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700">
                    Sign up
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden space-x-2 sm:block">
            <Link href="/login">
              <span className="text-md rounded-md bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700">
                Login
              </span>
            </Link>
            <Link href="/signup">
              <span className="text-md rounded-md bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700">
                Sign up
              </span>
            </Link>
          </div>
        </>
      );
    };

    return (
      <>
        <div className="flex items-center justify-start">
          <SessionView />
        </div>
      </>
    );
  };

  const pages = PagesConfig.map((prop, index) => {
    return (
      <NavigationLink
        key={index}
        label={prop.label}
        href={prop.href}
        requiresAccount={prop.requiresAccount}
        allowRoles={prop.allowRoles}
      />
    );
  });

  return (
    <nav className="rounded-lg bg-gray-800">
      <div className="mx-auto max-w-[1400px] px-2">
        <div className="flex items-center justify-between">
          <div className="flex h-full items-center justify-start">{pages}</div>
          <AccountInfo />
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
