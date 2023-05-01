import type { MedItem, Meds } from "@prisma/client";

import type { RouterOutputs } from "../../lib/api";

type PrescriptionDetails = RouterOutputs["prescribe"]["byId"];

type MedItemAndMeds = MedItem & { meds: Meds };

/**
 * Individual line item display for the Prescription summary.
 */
const PrescriptionMedItem = ({ medItem }: { medItem: MedItemAndMeds }) => {
  return (
    <div className="flex w-80 flex-row justify-between px-2">
      <section className="space-x-2">
        <span className="inline-block">
          {medItem.meds.name} {medItem.dosage} {medItem.meds.unit}{" "}
          {medItem.dosageFreq}
        </span>
      </section>
    </div>
  );
};

/**
 * Prescription summary view, meant to resemble a receipt
 */
const PrescriptionSummary = ({
  Prescription,
}: {
  Prescription: PrescriptionDetails;
}) => {
  if (!Prescription) return <div />;

  let noMedItems = true;
  // check if the prescription is empty, if it is, display empty prescripton
  for (const prescrip of Prescription) {
    if (prescrip.medItems.length > 0) {
      noMedItems = false;
      break;
    }
  }
  if (noMedItems) {
    return (
      <div className="h-fit rounded-xl border border-neutral-400 bg-yellow-200 p-2 drop-shadow-xl">
        <h1 className="mb-2 text-center text-lg font-bold">
          Prescription Summary
        </h1>
        <div className="flex w-80 flex-row justify-between px-2">
          <section className="space-x-2">
            <span className="inline-block">No Medications Prescribed Yet</span>
          </section>
        </div>
      </div>
    );
  }
  return (
    <div className="h-fit rounded-xl border border-neutral-400 bg-yellow-200 p-2 drop-shadow-xl">
      <h1 className="mb-2 text-center text-lg font-bold">
        Prescription Summary
      </h1>

      {/** Med item total summary */}
      <div className="mb-2 flex flex-col divide-y divide-dotted divide-neutral-400">
        {Prescription.map((item, index) => {
          for (let i = 0; i < item.medItems.length; i++) {
            const medItem = item.medItems[i] as MedItemAndMeds;
            return <PrescriptionMedItem key={index} medItem={medItem} />;
          }
        })}
      </div>
    </div>
  );
};

/**
 * Main Prescription overview component displayed on /Prescription/[id]
 */
const PrescriptionOverview = ({
  Prescription,
}: {
  Prescription: PrescriptionDetails;
}) => {
  return (
    <div className="mx-auto space-x-8">
      <PrescriptionSummary Prescription={Prescription} />
    </div>
  );
};

export { PrescriptionOverview };
