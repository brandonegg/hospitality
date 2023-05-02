import type { VisitReport } from "@prisma/client";
import Link from "next/link";

/**
 * Button for linking to create report form
 */
const CreateReportButton = () => {
  return (
    <Link
      className="rounded-lg border border-neutral-600 bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
      href="/report/create"
    >
      Create Report +
    </Link>
  );
};

/**
 * Single report summary line
 */
const ReportLine = ({ report }: { report: VisitReport }) => {
  return <div></div>;
};

/**
 * Main doctor report dashboard view
 */
const DoctorReportDashboard = ({
  reports,
}: {
  reports: VisitReport[] | undefined;
}) => {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-row justify-end rounded-xl border border-neutral-400 bg-neutral-200 p-2 drop-shadow">
        <CreateReportButton />
      </div>
      <div className="p-4">
        {/** Display reports created by doctor */}
        {reports?.map((report, index) => {
          return <ReportLine key={index} report={report} />;
        })}
      </div>
    </div>
  );
};

export { DoctorReportDashboard };
