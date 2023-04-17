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
const DashBoardNavButton = ({
  href,
  label,
  selected,
}: DashBoardNavButtonProperties) => {
  if (selected) {
    return (
      <>
        <div className="box-content h-full rounded-t-lg border-x-[1px] border-t-[1px] border-gray-400 bg-gray-200 px-3">
          <div className="grid h-full w-full place-content-center text-center">
            <span className="text-lg">{label}</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Link
        href={href}
        className="box-content h-full rounded-t-lg border-x-[1px] border-t-[1px] border-transparent px-3 hover:border-gray-400 hover:bg-gray-200"
      >
        <div className="grid h-full w-full place-content-center text-center">
          <span className="text-lg">{label}</span>
        </div>
      </Link>
    </>
  );
};

/**
 * Nav bar button component for the quick access drop down.
 * @param param0
 */
const DashBoardQuickAccessNavButton = ({
  href,
  label,
  selected,
}: DashBoardNavButtonProperties) => {
  if (selected) {
    return (
      <li>
        <span className="block w-full bg-gray-500 py-1 text-lg text-gray-200">
          {label}
        </span>
      </li>
    );
  }

  return (
    <li>
      <Link href={href}>
        <span className="block w-full py-1 text-lg text-gray-200 hover:bg-gray-500">
          {label}
        </span>
      </Link>
    </li>
  );
};

export { DashBoardNavButton, DashBoardQuickAccessNavButton };
export type { DashBoardNavButtonProperties };
