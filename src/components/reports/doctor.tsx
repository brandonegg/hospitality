import { TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import type { VisitReportSummary } from "../../server/api/routers/visitReport";

/**
 * Button for linking to create report form
 */
const CreateReportButton = () => {
  return (
    <Link
      className="rounded-lg border border-blue-400 bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
      href="/report/create"
    >
      Create Report +
    </Link>
  );
};

/**
 * Single report summary line
 */
const ReportLine = ({ report }: { report: VisitReportSummary }) => {
  const shortName =
    report.patient_name?.split(" ").map((value) => {
      return value.at(0)?.toUpperCase();
    }) ?? "";

  return (
    <div className="flex flex-row justify-between rounded-xl border border-neutral-200 bg-neutral-100 py-2 px-4 shadow-lg">
      <div className="grid h-16 w-16 place-items-center rounded-full border border border-neutral-400 bg-green-300">
        <span className="text-2xl font-bold">{shortName}</span>
      </div>
      <button className="group my-auto h-fit rounded-lg border border-red-300 bg-red-200 p-2 hover:bg-red-400">
        <TrashIcon className="w-8 text-neutral-600 group-hover:text-black" />
      </button>
    </div>
  );
};

/**
 * Main doctor report dashboard view
 */
const DoctorReportDashboard = ({
  reports,
}: {
  reports: VisitReportSummary[] | undefined;
}) => {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-row justify-end rounded-xl border border-neutral-400 bg-neutral-200 p-2 drop-shadow">
        <CreateReportButton />
      </div>
      <div className="space-y-4 p-4">
        {!reports || reports.length == 0 ? (
          <h1 className="text-center text-xl font-bold text-neutral-600">
            No reports authored yet!
          </h1>
        ) : (
          <h1 className="text-xl font-bold text-neutral-600">
            Previously Authored:
          </h1>
        )}
        {/** Display reports created by doctor */}
        <div className="px-4">
          {reports?.map((report, index) => {
            return <ReportLine key={index} report={report} />;
          })}
        </div>
      </div>
    </div>
  );
};

export { DoctorReportDashboard };
