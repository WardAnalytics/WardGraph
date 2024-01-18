import { FC, useContext } from "react";
import {
  XMarkIcon,
  PresentationChartLineIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/20/solid";

import LabelList from "./components/LabelList";
import CopyToClipboardIcon from "./components/CopyToClipboardIcon";
import BlockExplorerAddressIcon from "./components/BlockExplorerAddressIcon";
import RiskIndicator from "./components/RiskIndicator";
import BigButton from "../../../common/BigButton";
import EntityLogo from "../../../common/EntityLogo";

import { AnalysisContext } from "../AnalysisWindow";

interface HeaderProps {
  onExit: () => void;
  toggleAnalysisMode: () => void;
  analysisMode: boolean;
}

const Header: FC<HeaderProps> = ({
  onExit,
  toggleAnalysisMode,
  analysisMode,
}: HeaderProps) => {
  // Extract analysisData from context
  const { analysisData, address } = useContext(AnalysisContext);

  // When minimized, the address hash should be sliced off
  const displayedAddress = analysisMode
    ? address
    : address.slice(0, 8) + "..." + address.slice(-6);
  const risk = analysisData!.risk;

  return (
    <span className="flex cursor-move flex-row items-center justify-between gap-x-2">
      <span className="flex flex-row items-center space-x-2">
        {/* Address Risk inside a badge */}
        <RiskIndicator risk={risk} isLoading={false} />

        {/* Address information */}
        <div className="flex flex-col gap-y-0.5">
          <span className="flex flex-row items-center gap-x-1 gap-y-1">
            {/* Address Hash - Sliced when in non-expanded mode*/}
            <h1 className="font-xs flex flex-row font-mono font-semibold tracking-tight text-gray-800">
              {displayedAddress}
              <EntityLogo
                entity={analysisData!.labels[0]}
                className="ml-2 h-7 w-7 rounded-full"
              />
            </h1>

            {/* Clipboard and Block Explorer icons - only shown in expanded mode */}
            <CopyToClipboardIcon address={address} />
            {analysisData && (
              <BlockExplorerAddressIcon
                blockchain={analysisData.blockchain}
                address={address}
              />
            )}
          </span>
          <span className="flex flex-row items-center gap-x-1.5">
            {/* List of labels using Badges shown underneath the address. */}
            <LabelList labels={analysisData!.labels} />
          </span>
        </div>
      </span>

      {/* Exit button */}
      <span className="flex flex-row items-center gap-x-1.5">
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-all duration-300  hover:bg-blue-400 "
          onClick={() => toggleAnalysisMode()}
        >
          {analysisMode ? (
            <ArrowUturnLeftIcon
              className="h-5 w-5 rounded-full  text-white"
              aria-hidden="true"
            />
          ) : (
            <PresentationChartLineIcon
              className="h-5 w-5 rounded-full  text-white"
              aria-hidden="true"
            />
          )}
          {analysisMode ? "Overview" : "Analysis"}
        </button>
        <BigButton onClick={onExit} Icon={XMarkIcon} text="Exit" />
      </span>
    </span>
  );
};

export default Header;
