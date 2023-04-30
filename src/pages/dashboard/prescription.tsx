import { ChevronRightIcon } from "@heroicons/react/24/solid";
import type { Prescription } from "@prisma/client";
import { Role } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";

import Layout from "../../components/dashboard/layout";
import type { RouterOutputs } from "../../lib/api";
import { api } from "../../lib/api";

type PrescriptionResponseData =
  RouterOutputs["prescribe"]["getAllUserPrescriptions"];

/**
 * Bill summary view button
 */
const PrescriptionSummaryButton = ({
  details,
  index,
}: {
  details: Prescription;
  index: number;
}) => {
  return (
    <Link
      href={`/prescribe/${details.id}`}
      className="group flex flex-row space-x-6 rounded-xl border border-neutral-300 bg-neutral-100 p-4 drop-shadow-lg transition duration-100 hover:drop-shadow-none"
    >
      <div className="my-auto grow-0 rounded-xl border border-neutral-900 bg-yellow-200 p-2 drop-shadow">
        <Image alt="receipt" src="/receipt-logo.svg" width={36} height={36} />
      </div>
      <div className="flex grow flex-row divide-x divide-neutral-700">
        <div className="px-4">
          <h1 className="inline-block text-lg font-semibold">
            Number {index}{" "}
          </h1>
        </div>
      </div>
      <ChevronRightIcon className="my-auto h-8 grow-0 group-hover:animate-bounce_x" />
    </Link>
  );
};

/**
 * Wrapper for the different Prescriptions sections display on page (upcoming/paid etc.)
 */
const PrescriptionsSection = ({
  label,
  Prescriptions,
}: {
  id?: string;
  label: string;
  Prescriptions: PrescriptionResponseData;
}) => {
  return (
    <section id="upcoming-Prescriptions" className="grow-0 px-8">
      <h1 className="text-center text-xl font-bold text-sky-900">{label}</h1>
      <div className="mt-4 flex flex-col space-y-6">
        {Prescriptions.map((prescription, index) => {
          return (
            <PrescriptionSummaryButton
              key={index}
              details={prescription}
              index={index}
            />
          );
        })}
      </div>
    </section>
  );
};

/**
 * Main Prescriptions page. Will only show Prescriptions tied to the user.
 */
const PrescriptionsDashboardPage = ({ user }: { user: Session["user"] }) => {
  const { data: userPrescriptions } =
    api.prescribe.getAllUserPrescriptions.useQuery({
      userId: user.id,
    });

  return (
    <Layout>
      <div className="mx-auto flex w-full flex-col justify-center divide-x md:flex-row">
        {userPrescriptions && userPrescriptions.length !== 0 ? (
          <PrescriptionsSection
            label="Prescriptions"
            Prescriptions={userPrescriptions}
          />
        ) : undefined}
      </div>
    </Layout>
  );
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

  const authorizedUsers: Role[] = [Role.PATIENT];

  // If the user is not patient, redirect to the dashboard
  if (!authorizedUsers.includes(session.user.role)) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user,
    },
  };
};

export default PrescriptionsDashboardPage;
