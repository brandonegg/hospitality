import { HeartIcon } from "@heroicons/react/24/solid";
import Image from 'next/image';

interface VitalsInfo {
    icon: JSX.Element,
    label: string,
    value: string,
    unit: string,
}

const demoVitals: VitalsInfo[] = [
    {
        icon: <HeartIcon className='w-10 text-rose-600'/>,
        label: "Pulse",
        value: "76",
        unit: "bpm",
    },
    {
        icon: <Image alt="thermometer" src="thermometer.svg" width={48} height={32}/>,
        label: "Temperature",
        value: "96",
        unit: "℉",
    },
    {
        icon: <Image alt="scale" src="weighing-scale.svg" width={32} height={32}/>,
        label: "Weight",
        value: "160",
        unit: "lb",
    },
    {
        icon: <Image alt="lungs" src="lungs.svg" width={36} height={32}/>,
        label: "Respiration",
        value: "16",
        unit: "",
    },
    {
        icon: <Image alt="human chest" src="human-chest.svg" width={32} height={32}/>,
        label: "Oxygen Saturation",
        value: "98",
        unit: "%",
    }
]

/**
 * Vitals widget view
 * @returns 
 */
const VitalsWidget = () => {
    /**
     * Single cell of a vitals row
     */
    const VitalsCell = ({icon, label, value, unit}: VitalsInfo) => {
        return (
            <div className="justify-center flex-1 space-x-4 flex flex-row">
                {icon}
                <div className="flex flex-col">
                    <h1 className="text-center text-lg font-semibold border-b-2">{label}</h1>
                    <p>{value} <span className="italic text-gray-700">{unit}</span></p>
                </div>
            </div>
        )
    }

    /**
     * Single row for vitals
     * @returns 
     */
    const VitalsRow = ({left, right}: {left: VitalsInfo, right?: VitalsInfo}) => {
        return (
            <li className="py-2 first:pt-0 justify-center divide-x-2 flex flex-row">
                <VitalsCell {...left} />
                {right ? <VitalsCell {...right}/> : null}
            </li>
        )
    };

    const vitalsRows = demoVitals.map((vitalsInfo, index) => {
        // Do two at a time, for left and right
        if (index % 2 === 0) {
            const left = vitalsInfo
            let right: VitalsInfo | undefined;

            if (index < demoVitals.length) {
                right = demoVitals[index+1];
            }

            return (
                <VitalsRow key={index} left={left} right={right}/>
            )
        }
    });

    return <>
        <div className="w-full">
            <div className="h-full bg-slate-100 p-2 flex flex-col">
                <div className="grow">
                    <ul className="w-full divide-y-2">
                        {vitalsRows}
                    </ul>
                </div>
                <h1 className="text-gray-400 text-xs text-right italic">Last recorded on 3/10/2023</h1>
            </div>
        </div>
    </>
}

export default VitalsWidget;