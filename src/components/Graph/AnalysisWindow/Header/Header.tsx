import {
  XMarkIcon
} from "@heroicons/react/20/solid";
import { FC, useContext } from "react";

import BigButton from "../../../common/BigButton";
import EntityLogo from "../../../common/EntityLogo";
import BlockExplorerAddressIcon from "./components/BlockExplorerAddressIcon";
import CopyToClipboardIcon from "./components/CopyToClipboardIcon";
import LabelList from "./components/LabelList";
import RiskIndicator from "./components/RiskIndicator";

import clsx from "clsx";
import TagInput from "../../../common/TagInput";
import { AnalysisContext, AnalysisMode, AnalysisModes } from "../AnalysisWindow";

interface ModeButtonProps {
  isActive: boolean;
  analysisMode: AnalysisMode;
  setAnalysisMode: (mode: AnalysisMode) => void;
}

const ModeButton: FC<ModeButtonProps> = ({
  isActive,
  analysisMode,
  setAnalysisMode,
}) => {
  return (
    <button
      type="button"
      className={clsx(
        "flex flex-row items-center gap-x-1 rounded-md px-3 py-2 text-sm font-semibold transition-all duration-300",
        {
          "bg-white text-gray-900 shadow-sm": isActive,
          "text-gray-700 hover:bg-gray-200": !isActive,
        },
      )}
      onClick={() => setAnalysisMode(analysisMode)}
    >
      <analysisMode.icon
        className={clsx("h-5 w-5 rounded-full", {
          "text-blue-500": isActive,
          "text-gray-700": !isActive,
        })}
        aria-hidden="true"
      />
      {analysisMode.name}
    </button>
  );
};

interface ModeToggleProps {
  analysisMode: AnalysisMode;
  setAnalysisMode: (mode: AnalysisMode) => void;
}

const ModeToggle: FC<ModeToggleProps> = ({ analysisMode, setAnalysisMode }) => {
  return (
    <span className="flex flex-row gap-x-0.5 rounded-md bg-gray-100 p-0.5 shadow-inner">
      {AnalysisModes.map((mode) => (
        <ModeButton
          key={mode.name}
          isActive={mode === analysisMode}
          analysisMode={mode}
          setAnalysisMode={setAnalysisMode}
        />
      ))}
    </span>
  );
};


interface HeaderProps {
  onExit: () => void;
  setAnalysisMode: (mode: AnalysisMode) => void;
  analysisMode: AnalysisMode;
}

const Header: FC<HeaderProps> = ({
  onExit,
  setAnalysisMode,
  analysisMode,
}: HeaderProps) => {
  // Extract analysisData from context
  const { analysisData, address } = useContext(AnalysisContext);

  // When minimized, the address hash should be sliced off
  const displayedAddress = analysisMode
    ? address
    : address.slice(0, 14) + "..." + address.slice(-12);
  const risk = analysisData!.risk;

  return (
    <span className="flex cursor-move flex-row items-center justify-between gap-x-2">
      <span className="flex flex-row items-center space-x-2">
        {/* Address Risk inside a badge */}
        <RiskIndicator risk={risk} isLoading={false} />
      </span>

      {/* Address information */}
      <div className="flex flex-col grow gap-y-0.5">
        <span className="flex flex-row items-center gap-x-1 gap-y-1">
          {/* Address Hash - Sliced when in non-expanded mode*/}
          <h1 className="grow font-xs flex flex-row font-mono font-semibold tracking-tight text-gray-800">
            {displayedAddress}
            <EntityLogo
              entity={analysisData!.labels[0]}
              className="ml-2 h-7 w-7 rounded-full"
            />
          </h1>

          <div className="flex flex-row items-center gap-x-1.5">
            {/* Clipboard and Block Explorer icons - only shown in expanded mode */}
            <CopyToClipboardIcon textToCopy={address} />
            {analysisData && (
              <BlockExplorerAddressIcon
                blockchain={analysisData.blockchain}
                address={address}
              />
            )}
          </div>
        </span>
        <span className="flex flex-row items-center gap-x-1.5">
          {/* List of labels using Badges shown underneath the address. */}
          <LabelList labels={analysisData!.labels} />
          <TagInput address={address} />

          {/* <TagInput address={address} /> */}
        </span>
      </div>

      {/* Exit button */}
      <span className="flex flex-row items-center gap-x-1.5">
        {/* Mode Toggle */}
        <ModeToggle
          analysisMode={analysisMode}
          setAnalysisMode={setAnalysisMode}
        />
        <BigButton onClick={onExit} Icon={XMarkIcon} text="Exit" />
      </span>
    </span>
  );
};

export default Header;
