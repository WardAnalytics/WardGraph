import { XMarkIcon } from "@heroicons/react/24/solid";

import { TrashIcon } from "@heroicons/react/24/outline";

import { XMarkIcon as XMarkSmallIcon } from "@heroicons/react/16/solid";

import clsx from "clsx";
import { FC, useCallback, useContext } from "react";

import {
  addCustomAddressTag,
  addCustomUserTag,
  removeCustomAddressTag,
  useCustomAddressTags,
  useCustomUserTags,
} from "../../../../services/firestore/user/custom_tags/";

import { Colors } from "../../../../utils/colors";

import Badge from "../../../common/Badge";
import EntityLogo from "../../../common/EntityLogo";
import RiskIndicator from "../../../common/RiskIndicator";
import BlockExplorerAddressIcon from "../../../common/utility_icons/BlockExplorerAddressIcon";
import CopyToClipboardIcon from "../../../common/utility_icons/CopyToClipboardIcon";

import { GraphContext } from "../../Graph";
import {
  AnalysisContext,
  AnalysisMode,
  AnalysisModes,
} from "../AnalysisWindow";

import WithAuth, { WithAuthProps } from "../../../auth/WithAuth";
import useAuthState from "../../../../hooks/useAuthState";
import TagInput from "./TagInput";

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
          "bg-white text-gray-900 shadow-md": isActive,
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
      <p
        className="w-fit overflow-hidden"
        // style={{
        //   maxWidth: isActive ? "5rem" : "0px",
        //   opacity: isActive ? 1 : 0,
        //   transition: "all 0.3s ease-in-out",
        // }}
      >
        {analysisMode.name}
      </p>
    </button>
  );
};

interface ModeToggleProps {
  analysisMode: AnalysisMode;
  setAnalysisMode: (mode: AnalysisMode) => void;
}

const ModeToggle: FC<ModeToggleProps> = ({ analysisMode, setAnalysisMode }) => {
  return (
    <span className="flex flex-row gap-x-0.5 rounded-lg border border-gray-300 bg-gray-100 p-1 shadow-inner ring-1 ring-inset ring-white">
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

// Expand with AI -------------------------------------------------------------

interface LabelsAndTagsProps extends WithAuthProps {}

// Label + Tag + Tag Input Wrapped Component

const LabelsAndTags: FC<LabelsAndTagsProps> = ({
  handleActionRequiringAuth,
}) => {
  const { analysisData, address } = useContext(AnalysisContext);
  const { user, isAuthenticated } = useAuthState();

  // Labels get displayed first in the flex-wrap
  const labels = analysisData!.labels;

  // Get user and address already existing tags from Firestore
  const { tags: userCustomTags } = useCustomUserTags(user ? user.uid : "");
  const { tags: addressCustomTags } = useCustomAddressTags({
    userID: user ? user.uid : "",
    address,
  });

  // Handlers for both creating and deleting tags
  const onCreateCustomAddressTag = useCallback(
    async (tag: string) => {
      // TODO - Catch not authenticated errors and show the auth dialog instead
      addCustomAddressTag(user ? user.uid : "", address, tag);
      addCustomUserTag(user ? user.uid : "", tag);
    },
    [addressCustomTags, userCustomTags],
  );

  const onDeleteCustomAddressTag = useCallback(
    async (tag: string) => {
      // TODO - Catch not authenticated errors and show the auth dialog instead
      removeCustomAddressTag(user ? user.uid : "", address, tag);
    },
    [addressCustomTags],
  );

  // Display everything and user input at the end in a flex-wrap
  return (
    <span className="flex w-96 flex-wrap items-center gap-x-1.5 gap-y-1">
      {labels.map((label) => (
        <Badge key={label} color={Colors.BLUE} text={label} />
      ))}
      {addressCustomTags.map((tag) => (
        <Badge
          key={tag}
          color={Colors.PURPLE}
          text={tag}
          Icon={XMarkSmallIcon}
          onClick={() => {
            onDeleteCustomAddressTag(tag);
          }}
        />
      ))}
      <div
        onClick={() => {
          if (!isAuthenticated) {
            sessionStorage.setItem(
              "focusedAddressData",
              JSON.stringify(analysisData),
            );
            handleActionRequiringAuth({
              pathname: "graph",
            });
          }
        }}
      >
        <TagInput
          currentAddressTags={addressCustomTags}
          currentUserTags={userCustomTags}
          onCreateCustomAddressTag={onCreateCustomAddressTag}
          onDeleteCustomAddressTag={onDeleteCustomAddressTag}
        />
      </div>
    </span>
  );
};

// Labels and Tags with authentication
// The tag input will only be shown if the user is authenticated
const LabelsAndTagsWithAuth = WithAuth(LabelsAndTags);

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
  const { deleteNodes } = useContext(GraphContext);
  const { analysisData, address } = useContext(AnalysisContext);

  // When minimized, the address hash should be sliced off
  const displayedAddress = address.slice(0, 8) + "..." + address.slice(-6);
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
            <CopyToClipboardIcon textToCopy={address} />
            {analysisData && (
              <BlockExplorerAddressIcon
                blockchain={analysisData.blockchain}
                address={address}
              />
            )}
          </span>
          <span className="flex flex-row items-center justify-start gap-x-1.5">
            {/* List of labels using Badges shown underneath the address. */}
            <LabelsAndTagsWithAuth />
          </span>
        </div>
      </span>

      {/* Exit button */}
      <span className="flex flex-row items-center gap-x-1.5">
        {/* Mode Toggle */}
        <ModeToggle
          analysisMode={analysisMode}
          setAnalysisMode={setAnalysisMode}
        />

        <span className="flex flex-row">
          <div className="group flex flex-row items-center justify-center">
            <TrashIcon
              onClick={() => {
                deleteNodes([address]);
                onExit();
              }}
              className="h-11 w-11 cursor-pointer rounded-md p-1.5 text-gray-400 transition-all duration-150 ease-in-out hover:bg-red-50 hover:text-red-500"
            />
            <div className="pointer-events-none absolute mb-24 mt-0.5 w-max origin-bottom scale-50 divide-y divide-gray-700 rounded-lg bg-gray-800 px-3 py-3 text-white opacity-0 shadow-sm transition-all duration-300 ease-in-out group-hover:scale-100 group-hover:opacity-100">
              Delete
            </div>
          </div>
          <div className="group flex flex-row items-center justify-center">
            <XMarkIcon
              onClick={onExit}
              className="h-11 w-11 cursor-pointer rounded-md p-1.5 text-gray-400 transition-all duration-150 ease-in-out hover:bg-gray-100"
            />
            <div className="pointer-events-none absolute mb-24 mt-0.5 w-max origin-bottom scale-50 divide-y divide-gray-700 rounded-lg bg-gray-800 px-3 py-3 text-white opacity-0 shadow-sm transition-all duration-300 ease-in-out group-hover:scale-100 group-hover:opacity-100">
              Close
            </div>
          </div>
        </span>
      </span>
    </span>
  );
};

export default Header;
