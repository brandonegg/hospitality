import Link from "next/link";
import { useState } from "react";

import { api } from "../../lib/api";
import Alert from "../Alert";

import { ReportLine } from "./common";

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
