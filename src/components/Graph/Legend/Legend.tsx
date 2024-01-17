import { FC, useContext } from "react";
import { InformationCircleIcon } from "@heroicons/react/16/solid";
import { GraphContext } from "../../../contexts/GraphContext";

import "./LegendPath.css";

const ForwardTip: FC = () => {
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
      <h3 className="text-xs font-semibold text-blue-700"> Forward </h3>
    </span>
  );
};

const BackwardTip: FC = () => {
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
      <h3 className="text-xs font-semibold text-orange-700">Backward</h3>
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
        <ForwardTip />
        <BackwardTip />
      </div>
    </div>
  );
};

export default Legend;
