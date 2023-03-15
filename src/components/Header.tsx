import { HeartIcon } from "@heroicons/react/24/solid";
import type { Session } from "next-auth";

import NavigationBar from "./NavigationBar";

/**
 * Main site header component with nav bar.
 * @param param0 
 * @returns 
 */
const MainHeader = ({user}: {user?: Session['user']}) => {
    return (
        <div id='header-content' className="m-2 sm:m-6">
            <h2 className="mb-2 sm:mb-6 text-4xl font-semibold flex items-center space-x-2"><HeartIcon className='w-9 h-9 text-red-600'/>
            <span>Hospitality</span>
            </h2>
            <NavigationBar user={user}/>
        </div>
    )
}

export default MainHeader;