import { HeartIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import type { NextPage } from "next/types";
import { useSession } from "next-auth/react";

import NavigationBar from "../components/NavigationBar";

/**
 * User dashboard page
 * @returns 
 */
const Dashboard: NextPage = () => {
    const router = useRouter();
    const { data: sessionData, status } = useSession({
        required: true,
        async onUnauthenticated() {
            await router.push('/login');
        },
    });

    // TODO: add loading animation until authentication has been received
    if (status === 'loading') {
        return <></>;
    }

    return <>
    <main className="max-w-[1400px] mx-auto">
        <div id='header-content' className="m-6">
            <h2 className="mb-6 text-4xl font-semibold flex items-center space-x-2"><HeartIcon className='w-9 h-9 text-red-600'/>
            <span>Hospitality</span>
            </h2>
            <NavigationBar session={sessionData}/>
        </div>
        <p>Temporary</p>
    </main>
    </>
};

export default Dashboard