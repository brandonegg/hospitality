import { DashboardNavBar } from "./navigation";

/**
 * Main dashboard layout. Adds the dashboard nav bar to the page.
 */
const Layout = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <>
      <div className="mx-auto max-w-[1400px]">
        <section className="m-4 border-b-2 px-2 sm:m-8">
          <DashboardNavBar />
        </section>
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
