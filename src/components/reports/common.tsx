import { TrashIcon } from "@heroicons/react/24/solid";
import type { SoapNote } from "@prisma/client";
import Link from "next/link";

import type { RouterOutputs } from "../../lib/api";
import { dateToString } from "../../lib/text";
import type { VisitReportSummary } from "../../server/api/routers/visitReport";
import { VitalsWidget } from "../vitals";

type FullVisitReport = RouterOutputs["visitReport"]["get"];

type DeleteCallback = ({ id }: { id: string }) => void;

/**
 * Single report summary line
 */
const ReportLine = ({
  report,
  deleteReport,
}: {
  report: VisitReportSummary;
  deleteReport?: DeleteCallback | undefined;
}) => {
  const shortName =
    report.patient_name?.split(" ").map((value) => {
      return value.at(0)?.toUpperCase();
    }) ?? "";

  /**
   * Deletes the row item
   */
  const onClick = () => {
    if (deleteReport) {
      deleteReport({ id: report.id });
    }
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
        {deleteReport ? (
          <button
            onClick={onClick}
            className="group my-auto grid h-12 w-12 place-items-center rounded-lg border border-red-300 bg-red-200 hover:bg-red-400"
          >
            <TrashIcon className="w-8 text-neutral-600 group-hover:text-black" />
          </button>
        ) : undefined}
      </div>
    </div>
  );
};

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
    <div className="flex grow flex-col overflow-hidden rounded-xl border border-gray-600">
      <div className="bg-slate-800 p-1">
        <h2 className="text-center font-semibold text-white">{label}</h2>
      </div>
      <div className="relative grow">{children}</div>
    </div>
  );
};

/**
 * Creates visit information body
 */
const VisitInfo = ({ report }: { report: FullVisitReport }) => {
  return (
    <div className="grid h-full place-items-center bg-slate-100 text-center">
      <div className="mx-auto flex w-fit flex-col">
        <h1 className="border-b-2 border-gray-200 text-center text-lg font-semibold">
          Doctor
        </h1>
        <span>{report.author?.name}</span>
      </div>
      <div className="mx-auto flex w-fit flex-col">
        <h1 className="border-b-2 border-gray-200 text-center text-lg font-semibold">
          Visit Date
        </h1>
        <span>{dateToString(report.date)}</span>
      </div>
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
          <VisitInfo report={report} />
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

export { FullVisitReportSummary, ReportLine };
