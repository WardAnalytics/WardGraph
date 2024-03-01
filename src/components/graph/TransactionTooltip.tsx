import { FC } from "react";
import { ArrowRightIcon, BarsArrowDownIcon } from "@heroicons/react/16/solid";
import formatNumber from "../../utils/formatNumber";

interface TransactionTooltipProps {
  source: string;
  target: string;
  volume: number;
  x: number;
  y: number;
}

const TransactionTooltip: FC<TransactionTooltipProps> = ({
  source,
  target,
  volume,
  x,
  y,
}: TransactionTooltipProps) => {
  return (
    <div
      className="fixed z-50 flex h-fit w-fit -translate-x-full transform-gpu flex-col items-center gap-y-1 divide-y divide-gray-600/20 rounded-lg bg-gray-50/50 p-3 ring-1 ring-gray-600/20 backdrop-blur-md"
      style={{
        left: x + 10,
        top: y + 10,
      }}
    >
      <div>
        <span className="flex h-full w-full flex-row items-center justify-center gap-x-2">
          <h3 className="font-mono text-xs font-medium text-gray-400">
            {source.slice(0, 5)}...{source.slice(-5)}
          </h3>
          <ArrowRightIcon className="h-5 w-5 text-gray-400" />
          <h3 className="font-mono text-xs font-medium text-gray-400">
            {target.slice(0, 5)}...{target.slice(-5)}
          </h3>
        </span>
        <h1 className=" w-full text-center text-lg font-bold text-gray-600">
          {formatNumber(volume)}
        </h1>
      </div>

      <h1 className="flex w-full flex-row justify-center gap-x-1 pt-1 text-center text-xs font-medium text-gray-400">
        Click edge to{" "}
        <a className="font-bold text-gray-500">view transactions</a>
        <BarsArrowDownIcon className="mt-0.5 inline-block h-4 w-4 text-gray-500" />
      </h1>
    </div>
  );
};

export default TransactionTooltip;
export type { TransactionTooltipProps };
