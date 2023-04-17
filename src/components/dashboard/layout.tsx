import { DashboardNavBar } from "./navigation";

/**
 * Main dashboard layout. Adds the dashboard nav bar to the page.
 */
const Layout = ({ children }: {
    children: JSX.Element,
}) => {
    return (
      <>
        <div className="max-w-[1400px] mx-auto">
            <section className="px-2 m-4 sm:m-8 border-b-2">
                <DashboardNavBar />
            </section>
            <main>
                {children}
            </main>
        </div>
      </>
    );
};

export default Layout;
