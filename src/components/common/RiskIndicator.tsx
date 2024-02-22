import { FC } from "react";
import {
  InformationCircleIcon,
  ArrowsPointingInIcon,
  ChevronDoubleDownIcon,
  IdentificationIcon,
} from "@heroicons/react/16/solid";
import clsx from "clsx";

import LoadingCircle from "./LoadingCircle";
import { getRiskLevelColors, RiskLevelColors } from "../../utils/risk_levels";
import { round } from "lodash";

interface RiskIndicatorProps {
  isLoading: boolean;
  risk?: number;
}

/** Displays a risk indicator badge.
 * @param isLoading: whether the risk is still loading
 * @param risk: the risk to display
 */

const RiskIndicator: FC<RiskIndicatorProps> = ({
  isLoading,
  risk,
}: RiskIndicatorProps) => {
  const color: RiskLevelColors | null = risk ? getRiskLevelColors(risk) : null;

  return (
    <span
      className={clsx(
        "group my-1 flex h-11 w-11 items-center justify-center rounded-md text-lg font-semibold shadow-sm ring-1",
        color?.textColor,
        color?.backgroundColor,
        color?.hoveredBackgroundColor,
        color?.ringColor,
      )}
    >
      {isLoading ? <LoadingCircle className="p-3" /> : round(risk!, 1)}
      <div className="pointer-events-none absolute mb-48 mt-0.5 w-max origin-bottom scale-0 divide-y divide-gray-700 rounded-lg bg-gray-800 px-3 py-3 text-white opacity-0 shadow-sm transition-all duration-300 ease-in-out group-hover:scale-100 group-hover:opacity-100 dark:bg-gray-700 ">
        <div className="flex flex-row items-center gap-x-1.5 pb-1">
          <InformationCircleIcon className="h-5 w-5 text-blue-200" />
          <h1 className="text-base font-semibold leading-7">Risk Score</h1>
        </div>
        <div className="flex max-w-xs flex-col gap-y-1.5 pt-1 text-xs font-normal text-gray-400">
          The risk score goes from 1 to 10 and is calculated based on the
          following parameters:
          <ul className="flex flex-col gap-y-2 pl-3 text-white">
            <li className="flex flex-row items-center gap-x-1">
              <IdentificationIcon className="h-5 w-5 text-blue-200" />
              <span className="font-bold">Labeled data</span>of the address
            </li>
            <li className="flex flex-row items-center gap-x-1">
              <ArrowsPointingInIcon className="h-5 w-5 text-blue-200" />
              <span className="font-bold">Direct Exposure,</span> both incoming and
              outgoing
            </li>
            <li className="flex flex-row items-center gap-x-1">
              <ChevronDoubleDownIcon className="h-5 w-5 text-blue-200" />
              <span className="font-bold">Indirect Exposure,</span> both incoming and
              outgoing
            </li>
          </ul>
        </div>
      </div>
    </span>
  );
};

export default RiskIndicator;
