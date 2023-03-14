import { DocumentCheckIcon, HeartIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import type { NextPage } from "next/types";
import { useSession } from "next-auth/react";

import NavigationBar from "../components/NavigationBar";
import VitalsWidget from "../components/dashboard/Vitals";

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
const SquareWidget = ({title, width, children}: SquareWidgetProperties) => {
    /**
     * Widget title generation
     * @returns 
     */
    const Title = () => {
        if (!title) {
            return <>
            </>;
        }
        return <>
            <div className="bg-slate-800 text-gray-300">
                <div className="p-1">
                    <h1 className="font-bold text-center text-lg">{title}</h1>
                </div>
            </div>
        </>
    };
    
    return <>
        <div className={(width == 2 ? 'col-span-2' : 'col-span-1')}>
            <div className="border overflow-hidden border-gray-600 rounded-xl drop-shadow-lg">
                <Title/>
                {children}
            </div>
        </div>
    </>
};

interface DashBoardNavButtonProperties {
    href: string;
    label: string;
    selected?: boolean;
}

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
        </>
    }
    
    return <>
        <Link href={href} className="box-content rounded-t-lg hover:bg-gray-200 border-x-[1px] border-t-[1px] border-transparent hover:border-gray-400 h-full px-3">
            <div className="grid place-content-center h-full w-full text-center">
                <span className="text-lg">{label}</span>
            </div>
        </Link>
    </>
}

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
        <div className="m-6 gap-4">
            <section className="px-2 m-8 border-b-2">
                <div className="flex justify-between">
                    <span className="hidden lg:inline">
                        <h2 className="hidden md:inline font-bold text-3xl">Welcome, {sessionData.user.name}</h2>
                    </span>
                    <span className="lg:hidden">
                        <h2 className="hidden md:inline font-bold text-3xl">Welcome!</h2>
                    </span>
                    <div className="hidden sm:flex mx-auto md:m-0">
                        <DashBoardNavButton selected={true} label="Overview" href="/"/>
                        <DashBoardNavButton label="Appointments" href="/"/>
                        <DashBoardNavButton label="Documents" href="/"/>
                        <DashBoardNavButton label="Refills" href="/"/>
                        <DashBoardNavButton label="Profile" href="/"/>
                    </div>
                    <div className="w-full sm:hidden mb-2">
                        <button className="text-md font-semibold border-2 border-slate-900 bg-slate-200 w-full py-2 rounded-lg">
                            Quick Access ▼
                        </button>
                    </div>
                </div>
            </section>

            <div className="sm:m-8">
                <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 sm:grid-cols-3 gap-8">
                    <SquareWidget title="Upcomming Appointments" width={2}>
                        <div className="p-2 bg-yellow-100 h-full">
                        </div>
                    </SquareWidget>
                    <SquareWidget width={1} title="Insurance">
                        <div className="w-full">
                            <div className="h-full bg-slate-100 p-2">
                                <p className="pt-1 italic">Everything is up-to-date!</p>
                                <DocumentCheckIcon className="mx-auto text-green-700 my-auto text-center mt-2 w-8"/>
                            </div>
                        </div>
                    </SquareWidget>
                    <SquareWidget width={2} title="Vitals">
                        <VitalsWidget/>
                    </SquareWidget>
                </div>
            </div>
        </div>
    </main>
    </>
};

export default Dashboard