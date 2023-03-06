/**
 * Navigation bar component displayed at the top of page for convenience navigating to various site resources and pages
 */
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
        label: <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
        </>,
        href: '/'
    },
    {
        label: 'Dashboard',
        href: '/dashboard'
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
        <Link className='h-full' href={href}>
            <div className="px-3 h-full text-md font-medium text-white hover:bg-gray-700">{label}</div>
        </Link>
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
            <span className="px-3 py-2 rounded-md text-md font-medium text-white bg-indigo-600 hover:bg-indigo-700">Login</span>
        </Link>
        <Link href="/signup">
            <span className="px-3 py-2 rounded-md text-md font-medium text-white bg-indigo-600 hover:bg-indigo-700">Sign up</span>
        </Link>
        </>
    );

    const pages = PagesConfig.map(prop => {
        return NavigationLink(prop);
    });

    return (
        <nav className="bg-gray-800 rounded-lg">
            <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-start">
                    <div className="hidden md:block"></div>
                    {pages}
                    <div className="py-4">
                        {links}
                    </div>
                </div>
            </div>
        </nav>
    );

};

export default NavigationBar;