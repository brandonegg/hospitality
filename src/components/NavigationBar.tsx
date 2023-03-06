/**
 * Navigation bar component displayed at the top of page for convenience navigating to various site resources and pages
 */
import Link from 'next/link';

interface NavBarProps {
    loggedIn: boolean;
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
            <span className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Login</span>
        </Link>
        <Link href="/signup">
            <span className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Sign up</span>
        </Link>
        </>
    );

    return (
        <nav className="bg-gray-800">
        <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
            <div className="flex items-center justify-start">
                <div className="flex-shrink-0">
                <Link href="/">
                    <span className="text-white">
                    Logo
                    </span>
                </Link>
                </div>
                <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                    <Link href="/">
                    <span className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700">Home</span>
                    </Link>
                    {links}
                </div>
                </div>
            </div>
            </div>
        </div>
        </nav>
    );
};

export default NavigationBar;