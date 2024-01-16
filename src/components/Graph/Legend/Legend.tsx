import { FC } from "react";
import { InformationCircleIcon } from "@heroicons/react/16/solid";

import "./LegendPath.css";

const RightTip: FC = () => {
  return (
    <span className="flex flex-row items-center gap-x-1.5">
      <svg className="h-5" viewBox="0 0 50 20">
        <path
          d={`M5,10 H45`}
          fill="none"
          className="animated-dotted-line animate-pulse stroke-blue-400"
          strokeWidth={7}
        />
        <path
          d={`M5,10 H45`}
          fill="none"
          className="animate-pulse stroke-blue-400 opacity-50"
          strokeWidth={7}
          strokeLinecap="round"
        />
      </svg>
      <h3 className="text-xs font-semibold text-blue-700"> Right </h3>
    </span>
  );
};

const LeftTip: FC = () => {
  return (
    <span className="flex flex-row items-center gap-x-1.5">
      <svg className="h-5" viewBox="0 0 50 20">
        <path
          d={`M5,10 H45`}
          fill="none"
          className="animated-dotted-line-reverse animate-pulse stroke-orange-400"
          strokeWidth={7}
        />
        <path
          d={`M5,10 H45`}
          fill="none"
          className="animate-pulse stroke-orange-400 opacity-50"
          strokeWidth={7}
          strokeLinecap="round"
        />
      </svg>
      <h3 className="text-xs font-semibold text-orange-700">Left</h3>
    </span>
  );
};

const RiskTip: FC = () => {
  return (
    <span className="flex flex-row items-center gap-x-1.5">
      <h1 className="flex h-9 w-9 items-center justify-center rounded-md bg-red-50 text-center text-sm font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
        8.2
      </h1>
      <h3 className="text-xs font-semibold text-red-700"> Risk </h3>
    </span>
  );
};

const Legend: FC = () => {
  return (
    <div className="flex h-fit w-32 flex-col items-center gap-y-3 divide-y divide-gray-300 bg-white/10 p-3 backdrop-blur-sm">
      <h2 className="flex flex-row items-center gap-x-1 text-xs font-semibold tracking-wide text-gray-600">
        <InformationCircleIcon className="h-5 w-5 text-gray-400" />
        LEGEND
      </h2>
      <div className="flex flex-col gap-y-3 pt-3">
        <RightTip />
        <LeftTip />
      </div>
      <div className="flex flex-col gap-y-3 pt-3">
        <RiskTip />
      </div>
    </div>
  );
};

export default Legend;
