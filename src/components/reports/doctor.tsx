import { TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";

import { api } from "../../lib/api";
import { dateToString } from "../../lib/text";
import type { VisitReportSummary } from "../../server/api/routers/visitReport";
import Alert from "../Alert";

/**
 * Button for linking to create report form
 */
const CreateReportButton = () => {
  return (
    <Link
      className="rounded-lg border border-blue-400 bg-blue-500 px-4 py-2 font-semibold text-white drop-shadow-lg transition duration-200 hover:bg-blue-600 hover:drop-shadow-sm"
      href="/report/create"
    >
      Create Report +
    </Link>
  );
};

type DeleteCallback = ({ id }: { id: string }) => void;

/**
 * Single report summary line
 */
const ReportLine = ({
  report,
  deleteReport,
}: {
  report: VisitReportSummary;
  deleteReport: DeleteCallback;
}) => {
  const shortName =
    report.patient_name?.split(" ").map((value) => {
      return value.at(0)?.toUpperCase();
    }) ?? "";

  /**
   * Deletes the row item
   */
  const onClick = () => {
    deleteReport({ id: report.id });
  };

  return (
    <div className="flex flex-row justify-between rounded-xl border border-neutral-200 bg-neutral-100 py-2 px-4 shadow-lg">
      <div className="flex flex-row space-x-4">
        <div className="grid h-16 w-16 place-items-center rounded-full border border border-neutral-400 bg-green-300">
          <span className="text-2xl font-bold">{shortName}</span>
        </div>
        <div className="my-auto h-fit space-x-2">
          <h1 className="inline-block text-xl font-semibold">
            {report.patient_name}
          </h1>
          <span className="inline-block text-lg italic text-neutral-400">
            on {dateToString(report.date)}
          </span>
        </div>
      </div>
      <div className="my-auto flex h-fit flex-row space-x-4">
        <Link
          href={`/report/${report.id}`}
          className="group my-auto grid h-12 place-items-center rounded-lg border border-blue-300 bg-blue-200 px-4 font-semibold text-neutral-600 hover:bg-blue-400 hover:text-white"
        >
          View Report
        </Link>
        <button
          onClick={onClick}
          className="group my-auto grid h-12 w-12 place-items-center rounded-lg border border-red-300 bg-red-200 hover:bg-red-400"
        >
          <TrashIcon className="w-8 text-neutral-600 group-hover:text-black" />
        </button>
      </div>
    </div>
  );
};

/**
 * Main doctor report dashboard view
 */
const DoctorReportDashboard = ({ doctorId }: { doctorId: string }) => {
  const [error, setError] = useState<string | undefined>();
  const { data: reports, refetch } = api.visitReport.getAll.useQuery({
    doctorId,
  });

  const { mutate: deleteReport } = api.visitReport.delete.useMutation({
    onSuccess: async () => {
      await refetch();
    },
    onError: (error) => setError(error.message),
  });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mx-auto w-fit">
        <CreateReportButton />
      </div>
      {error ? (
        <div className="mx-auto mt-8 max-w-lg">
          <Alert type="error">{error}</Alert>
        </div>
      ) : undefined}
      <div className="space-y-4 py-4 px-8">
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
        <div className="">
          {reports?.map((report, index) => {
            return (
              <ReportLine
                deleteReport={deleteReport}
                key={index}
                report={report}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { DoctorReportDashboard };
