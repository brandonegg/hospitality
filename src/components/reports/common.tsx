import type { RouterOutputs } from "../../lib/api";
import { dateToString } from "../../lib/text";
import { VitalsWidget } from "../vitals";

type FullVisitReport = RouterOutputs["visitReport"]["get"];

/**
 * Creates the rounded section components to wrap the contents
 */
const SectionContainer = ({
  children,
  label,
}: {
  label: string;
  children?: JSX.Element | JSX.Element[];
}) => {
  return (
    <div className="grow overflow-hidden rounded-xl border border-gray-600">
      <div className="bg-slate-800 p-1">
        <h2 className="text-center font-semibold text-white">{label}</h2>
      </div>
      {children}
    </div>
  );
};

/**
 * Displays full report, vitals and soap notes
 */
const FullVisitReportSummary = ({ report }: { report: FullVisitReport }) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-row justify-between border-b border-neutral-600 pb-2">
        <div>
          <h1 className="text-4xl font-bold">Report Summary</h1>
          <h2 className="text-xl text-neutral-600">
            Report written for {report.patient?.name}
          </h2>
        </div>
        <div className="text-md mt-auto px-2 italic text-neutral-400">
          <span>{dateToString(report.date)}</span>
        </div>
      </div>

      <div className="flex flex-row space-x-8">
        <SectionContainer label="Vitals">
          {report.vitals ? <VitalsWidget vitals={report.vitals} /> : undefined}
        </SectionContainer>
        <SectionContainer label="Visit Information">
          <div className="h-full bg-slate-100">
            <h2>Authored by:</h2>
            <span>{report.author?.name}</span>
          </div>
        </SectionContainer>
      </div>

      <SectionContainer label="Doctor Notes"></SectionContainer>
    </div>
  );
};

export { FullVisitReportSummary };
