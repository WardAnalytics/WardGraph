import { FC } from "react";

import "./LegendPath.css";

const Legend: FC = () => {
  return (
    <div className="flex h-fit w-32 flex-col gap-y-3 bg-white/50 p-3 backdrop-blur-sm">
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
        <h3 className="text-sm font-semibold text-blue-700"> Right </h3>
      </span>
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
        <h3 className="text-sm font-semibold text-orange-700">Left</h3>
      </span>
    </div>
  );
};

export default Legend;
