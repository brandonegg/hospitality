/**
 * Navigation bar component displayed at the top of page for convenience navigating to various site resources and pages
 */
import { Bars3Icon, HomeIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import type { ReactNode } from 'react';

/**
 * Add links for the navigation bar to this object.
 */
const PagesConfig: NavLinkProps[] = [
    {
        label: <HomeIcon className='h-6 w-6'/>,
        href: '/',
        requiresAccount: false,
    },
    {
        label: 'Dashboard',
        href: '/dashboard',
        requiresAccount: true,
    },
    {
        label: 'Support',
        href: '/support',
        requiresAccount: false,
    }
]

interface NavLinkProps {
    label: string | ReactNode,
    href: string,
    requiresAccount: boolean
}

interface NavBarProps {
    user?: Session['user'];
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
    const NavigationLink = ({ href, label, requiresAccount }: NavLinkProps ) => {
        const hidden = requiresAccount && !user;
        
        return <>
            <div className='hover:bg-gray-700'>
                <Link href={href}>
                    <div className={"px-3 py-4 text-md font-medium text-white hover:bg-gray-700" + (hidden ? ' hidden' : '')}>{label}</div>
                </Link>
            </div>
        </>
    }

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
                    <div className="group relative h-full block mr-2 p-2 rounded-lg hover:bg-gray-700">
                        <UserCircleIcon className='w-7 h-7 text-white'/>
                        <div className='z-50 bg-white drop-shadow-xl border border-slate-600 rounded-md absolute hidden group-hover:block mt-2 right-0'>
                            <div className='flex flex-col'>
                                <button onClick={async () => {await signOut()}}>
                                    <p className="w-24 px-3 py-2 text-md font-medium text-white bg-blue-600 hover:bg-blue-700">Sign out</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
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
                        <Link href="/login">
                            <span className="px-3 py-2 rounded-md text-md font-medium text-white bg-blue-600 hover:bg-blue-700">Login</span>
                        </Link>
                        <Link href="/signup">
                            <span className="px-3 py-2 rounded-md text-md font-medium text-white bg-blue-600 hover:bg-blue-700">Sign up</span>
                        </Link>
                    </div>
                </>
            );
        }

        return <>
            <div className="flex items-center justify-start">
                <SessionView/>
            </div>
        </>
    }

    const pages = PagesConfig.map((prop, index) => {
        return (
            <NavigationLink key={index} label={prop.label} href={prop.href} requiresAccount={prop.requiresAccount} />
        )
    });

    return (
        <nav className="bg-gray-800 rounded-lg">
            <div className="px-2 max-w-[1400px] mx-auto">
                <div className='flex items-center justify-between'>
                    <div className="h-full flex items-center justify-start">
                        {pages}
                    </div>
                    <AccountInfo/>
                </div>
            </div>
        </nav>
    );

};

export default NavigationBar;