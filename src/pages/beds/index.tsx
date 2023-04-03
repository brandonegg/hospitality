import { Role } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";

import MainHeader from "../../components/Header";

/**
 * Beds Table view for creating, modifying, and deleting beds
 * @returns 
 */
const BedsPage = () => {
    const { data: sessionData } = useSession();

    return(
        <main className="mx-auto max-w-[1400px]">
            <MainHeader user={sessionData?.user} />
        </main>
    )
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
  
    // If the user is not an admin, redirect to the dashboard
    if (session.user.role !== Role.ADMIN) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }
  
    return { props: {} };
  };

export default BedsPage;
