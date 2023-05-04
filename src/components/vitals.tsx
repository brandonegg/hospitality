import { HeartIcon } from "@heroicons/react/24/solid";
import type { VitalsReport } from "@prisma/client";
import Image from "next/image";

interface VitalsInfo {
  icon: JSX.Element;
  label: string;
  value: string;
  unit: string;
}

/**
 * Single cell of a vitals row
 */
const VitalsCell = ({ icon, label, value, unit }: VitalsInfo) => {
  return (
    <div className="flex flex-1 flex-row justify-center space-x-4">
      {icon}
      <div className="flex flex-col">
        <h1 className="border-b-2 border-gray-200 text-center text-lg font-semibold">
          {label}
        </h1>
        <p>
          {value} <span className="italic text-gray-700">{unit}</span>
        </p>
      </div>
    </div>
  );
};

/**
 * Single row for vitals
 * @returns
 */
const VitalsRow = ({
  left,
  right,
}: {
  left: VitalsInfo;
  right?: VitalsInfo;
}) => {
  return (
    <li className="flex flex-row justify-center divide-x-2 divide-gray-300 py-2 first:pt-0">
      <VitalsCell {...left} />
      {right ? <VitalsCell {...right} /> : null}
    </li>
  );
};

/**
 * Vitals widget view
 * @returns
 */
const VitalsWidget = ({ vitals }: { vitals: VitalsReport }) => {
  const formattedVitals: VitalsInfo[] = [
    {
      icon: <HeartIcon className="w-10 text-rose-600" />,
      label: "Pulse",
      value: vitals.pulse.toString(),
      unit: "bpm",
    },
    {
      icon: (
        <Image
          alt="thermometer"
          src="/vitals/thermometer.svg"
          width={46}
          height={46}
        />
      ),
      label: "Temperature",
      value: vitals.temperature.toString(),
      unit: "℉",
    },
    {
      icon: (
        <Image
          alt="scale"
          src="/vitals/weighing-scale.svg"
          width={32}
          height={32}
        />
      ),
      label: "Weight",
      value: vitals.weight.toString(),
      unit: "lb",
    },
    {
      icon: (
        <Image alt="lungs" src="/vitals/lungs.svg" width={36} height={36} />
      ),
      label: "Respiration",
      value: vitals.respiration.toString(),
      unit: "",
    },
    {
      icon: (
        <Image
          alt="human chest"
          src="/vitals/human-chest.svg"
          width={32}
          height={32}
        />
      ),
      label: "Oxygen Saturation",
      value: vitals.oxygenSaturation.toString(),
      unit: "%",
    },
  ];

  const vitalsRows = formattedVitals.map((vitalsInfo, index) => {
    // Do two at a time, for left and right
    if (index % 2 === 0) {
      const left = vitalsInfo;
      let right: VitalsInfo | undefined;

      if (index < formattedVitals.length) {
        right = formattedVitals[index + 1];
      }

      return <VitalsRow key={index} left={left} right={right} />;
    }
  });

  return (
    <>
      <div className="w-full">
        <div className="flex h-full flex-col bg-slate-100 p-2">
          <div className="grow">
            <ul className="w-full divide-y-2 divide-gray-300">{vitalsRows}</ul>
          </div>
          <h1 className="text-right text-xs italic text-gray-400">
            Last recorded on 3/10/2023
          </h1>
        </div>
      </div>
    </>
  );
};

export { VitalsWidget };
