/**
 * Navigation bar component displayed at the top of page for convenience navigating to various site resources and pages
 */
import { Bars3Icon, HomeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface NavLinkProps {
    label: string | ReactNode,
    href: string,
}

/**
 * Add links for the navigation bar to this object.
 */
const PagesConfig: NavLinkProps[] = [
    {
        // TODO: Change this to 'import' the hero icon properly
        label: <HomeIcon className='h-6 w-6'/>,
        href: '/'
    },
    {
        label: 'Dashboard',
        href: '/dashboard'
    },
    {
        label: 'Support',
        href: '/support'
    }
]

interface NavBarProps {
    loggedIn: boolean;
}

/**
 * Singular navigation bar link component.
 * @param props Properties of nav link element to represent as component 
 */
const NavigationLink = ({ href, label }: NavLinkProps ) => {
    return <>
        <div className='hover:bg-gray-700'>
            <Link href={href}>
                <div className="px-3 py-4 text-md font-medium text-white hover:bg-gray-700">{label}</div>
            </Link>
        </div>
    </>
}


/**
 * Navigation bar component
 *
 * @param props Provide logged in user data is user signed into session
 * @returns 
 */
const NavigationBar = ({ loggedIn }: NavBarProps) => {
    const links = loggedIn ? (
        <>
        <Link href="/dashboard">
            <span className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Dashboard</span>
        </Link>
        <Link href="/logout">
            <span className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Logout</span>
        </Link>
        </>
    ) : (
        <>
        <Link href="/login">
            <span className="px-3 py-2 rounded-md text-md font-medium text-white bg-blue-600 hover:bg-blue-700">Login</span>
        </Link>
        <Link href="/signup">
            <span className="px-3 py-2 rounded-md text-md font-medium text-white bg-blue-600 hover:bg-blue-700">Sign up</span>
        </Link>
        </>
    );

    const pages = PagesConfig.map(prop => {
        return NavigationLink(prop);
    });

    return (
        <nav className="bg-gray-800 rounded-lg">
            <div className="px-2 max-w-[1400px] mx-auto">
                <div className='flex items-center justify-between'>
                    <div className="h-full flex items-center justify-start">
                        {pages}
                    </div>
                    <div className="flex items-center justify-start">
                        <div className="group relative h-full block mr-2 p-2 sm:hidden rounded-lg hover:bg-gray-700">
                            <Bars3Icon className='w-6 h-6 text-white'/>
                            <div className='z-50 bg-white drop-shadow-xl border border-slate-600 rounded-md absolute hidden group-hover:block mt-2 right-0'>
                                <div className='flex flex-col'>
                                    <Link href="/login">
                                        <p className="w-24 px-3 py-2 text-md font-medium text-white bg-blue-600 hover:bg-blue-700">Login</p>
                                    </Link>
                                    <Link href="/signup">
                                        <p className="w-24 px-3 py-2 text-md font-medium text-white bg-blue-600 hover:bg-blue-700">Sign up</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="hidden sm:block space-x-2">
                            {links}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );

};

export default NavigationBar;