import type { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

import { PrescriptionOverview } from "../../components/prescribe/PrescriptionOverview";
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
      PrescriptionId: context.params?.id?.toString(),
    },
  };
};

/**
 * Single prescription page
 */
const PrescriptionViewPage = ({
  PrescriptionId,
}: {
  PrescriptionId: string | undefined;
}) => {
  const { data: Prescription } = api.prescribe.byId.useQuery({
    id: PrescriptionId ?? "",
  });

  if (Prescription === null) {
    return <p>No Prescription found with this ID</p>;
  }

  if (!Prescription) {
    return <div></div>;
  }

  return (
    <div className="flex justify-center">
      <PrescriptionOverview Prescription={Prescription} />
    </div>
  );
};

export default PrescriptionViewPage;
