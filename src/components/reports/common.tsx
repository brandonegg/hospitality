import type { SoapNote } from "@prisma/client";

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
 * Creates the soap summary view
 */
const SoapSummary = ({ subjective, objective, assessment, plan }: SoapNote) => {
  /**
   * Single soap field section
   */
  const SoapEntry = ({ label, body }: { label: string; body: string }) => {
    return (
      <div className="space-y-2">
        <h3 className="text-xl">{label}</h3>
        <p className="h-48 w-full overflow-y-auto rounded-xl border border-neutral-400 bg-white p-2">
          {body}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <SoapEntry label="Subjective" body={subjective} />
      <SoapEntry label="Objective" body={objective} />
      <SoapEntry label="Assessment" body={assessment} />
      <SoapEntry label="Plan" body={plan} />
    </div>
  );
};

/**
 * Displays full report, vitals and soap notes
 */
const FullVisitReportSummary = ({ report }: { report: FullVisitReport }) => {
  return (
    <div className="mb-8 space-y-8">
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

      {report.soapNotes ? (
        <SectionContainer label="Doctor Notes">
          <div className="bg-slate-100 p-4">
            <SoapSummary {...report.soapNotes} />
          </div>
        </SectionContainer>
      ) : undefined}
    </div>
  );
};

export { FullVisitReportSummary };
