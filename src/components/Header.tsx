import { HeartIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";

import NavigationBar from "./NavigationBar";

/**
 * Main site header component with nav bar.
 */
const MainHeader = () => {
    const { data: sessionData } = useSession();

    return (
        <div id='header-content' className="m-2 sm:m-6">
            <h2 className="mb-2 sm:mb-6 text-4xl font-semibold flex items-center space-x-2"><HeartIcon className='w-9 h-9 text-red-600'/>
            <span>Hospitality</span>
            </h2>
            <NavigationBar user={sessionData?.user}/>
        </div>
    );
};

export default MainHeader;
