import { FC, useContext } from "react";
import { Transition } from "@headlessui/react";

import LabelList from "./components/LabelList";
import CopyToClipboardIcon from "./components/CopyToClipboardIcon";
import BlockExplorerAddressIcon from "./components/BlockExplorerAddressIcon";
import RiskIndicator from "./components/RiskIndicator";

import AddressNodeStates from "../../states";
import { AnalysisContext } from "../AddressNode";

interface HeaderProps {
  state: AddressNodeStates;
}

const Header: FC<HeaderProps> = ({ state }) => {
  // Extract analysisData from context
  const { analysisData, isLoading, address } = useContext(AnalysisContext);

  // When minimized, the address hash should be sliced off
  const displayedAddress =
    state === AddressNodeStates.MINIMIZED
      ? address.substring(0, 4) + "..." + address.substring(address.length - 4)
      : address;

  const risk = analysisData ? analysisData.risk : undefined;

  return (
    <span className="flex flex-row items-center space-x-2">
      {/* Address Risk inside a badge */}
      <RiskIndicator risk={risk} isLoading={isLoading} />

      {/* Address information */}
      <div className="flex flex-col gap-y-0.5">
        <span className="flex flex-row items-center gap-x-1 gap-y-1">
          {/* Address Hash - Sliced when in non-expanded mode*/}
          <h1 className="font-mono font-semibold tracking-tight text-gray-800">
            {displayedAddress}
          </h1>

          {/* Clipboard and Block Explorer icons - only shown in expanded mode */}
          <Transition
            show={state === AddressNodeStates.EXPANDED}
            enter="transition-all duration-500"
            enterFrom="opacity-0 -translate-x-2"
            enterTo="opacity-100 translate-x-0"
            leave="transition-all duration-500"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 -translate-x-2"
            className="flex flex-row items-center gap-x-0.5"
          >
            <CopyToClipboardIcon address={address} />
            {analysisData && (
              <BlockExplorerAddressIcon
                blockchain={analysisData.blockchain}
                address={address}
              />
            )}
          </Transition>
        </span>
        <span className="flex flex-row items-center gap-x-1.5">
          {/* List of labels using Badges shown underneath the address. */}
          <Transition
            show={analysisData !== null}
            enter="transition-all duration-500"
            enterFrom="opacity-0 -translate-x-2"
            enterTo="opacity-100 translate-x-0"
            leave="transition-all duration-500"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 -translate-x-2"
            className="flex flex-row items-center gap-x-0.5"
          >
            {analysisData && <LabelList labels={analysisData.labels} />}
          </Transition>
        </span>
      </div>
    </span>
  );
};

export default Header;
