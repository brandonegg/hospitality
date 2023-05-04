import { api } from "../../lib/api";

import { ReportLine } from "./common";

/**
 * Main patient report dashboard view
 */
const PatientReportDashboard = ({ patientId }: { patientId: string }) => {
  const { data: reports } = api.visitReport.getAll.useQuery({
    patientId,
  });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-4 py-4 px-8">
        {!reports || reports.length == 0 ? (
          <h1 className="text-center text-xl font-bold text-neutral-600">
            No reports assigned to you yet!
          </h1>
        ) : (
          <h1 className="text-xl font-bold text-neutral-600">
            Past Visit Reports:
          </h1>
        )}
        {/** Display reports created by doctor */}
        <div className="">
          {reports?.map((report, index) => {
            return <ReportLine key={index} report={report} />;
          })}
        </div>
      </div>
    </div>
  );
};

export { PatientReportDashboard };
