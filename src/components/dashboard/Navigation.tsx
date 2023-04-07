import Link from "next/link";

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
        </>;
    }

    return <>
        <Link href={href} className="box-content rounded-t-lg hover:bg-gray-200 border-x-[1px] border-t-[1px] border-transparent hover:border-gray-400 h-full px-3">
            <div className="grid place-content-center h-full w-full text-center">
                <span className="text-lg">{label}</span>
            </div>
        </Link>
    </>;
};

/**
 * Nav bar button component for the quick access drop down.
 * @param param0
 */
const DashBoardQuickAccessNavButton = ({href, label, selected}: DashBoardNavButtonProperties) => {
    if (selected) {
        return (
            <li>
                <span className="text-lg bg-gray-500 py-1 block w-full text-gray-200">{label}</span>
            </li>
        );
    }

    return (
        <li>
            <Link href={href}>
                <span className="text-lg hover:bg-gray-500 py-1 block w-full text-gray-200">{label}</span>
            </Link>
        </li>
    );
};

export { DashBoardNavButton, DashBoardQuickAccessNavButton };
export type { DashBoardNavButtonProperties };
