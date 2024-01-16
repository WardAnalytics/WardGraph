import { FC, useContext } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

import LabelList from "./components/LabelList";
import CopyToClipboardIcon from "./components/CopyToClipboardIcon";
import BlockExplorerAddressIcon from "./components/BlockExplorerAddressIcon";
import RiskIndicator from "./components/RiskIndicator";
import BigButton from "../../../common/BigButton";
import EntityLogo from "../../../common/EntityLogo";

import { AnalysisContext } from "../AnalysisWindow";

interface HeaderProps {
  onExit: () => void;
}

const Header: FC<HeaderProps> = ({ onExit }: HeaderProps) => {
  // Extract analysisData from context
  const { analysisData, address } = useContext(AnalysisContext);

  // When minimized, the address hash should be sliced off
  const displayedAddress = address;
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
            <h1 className="flex flex-row font-mono font-semibold tracking-tight text-gray-800">
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
      <BigButton onClick={onExit} Icon={XMarkIcon} text="Exit" />
    </span>
  );
};

export default Header;
