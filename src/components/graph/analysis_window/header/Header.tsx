import {
  ArrowsPointingInIcon,
  IdentificationIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";

import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/solid";

import { TrashIcon } from "@heroicons/react/24/outline";

import { XMarkIcon as XMarkSmallIcon } from "@heroicons/react/16/solid";

import clsx from "clsx";
import { FC, useCallback, useContext } from "react";

import { AddressAnalysis, Category } from "../../../../api/model";
import { CategoryClasses } from "../../../../utils/categories";

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
import { AnalysisContext, AnalysisMode, AnalysisModes } from "../AnalysisWindow";

import { PathExpansionArgs } from "../../Graph";

import WithAuth, { WithAuthProps } from "../../../../WithAuth";
import useAuthState from "../../../../hooks/useAuthState";
import { logAnalyticsEvent } from "../../../../services/firestore/analytics/analytics";
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
        style={{
          maxWidth: isActive ? "5rem" : "0px",
          opacity: isActive ? 1 : 0,
          transition: "all 0.3s ease-in-out",
        }}
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

function getCategoryPaths(
  originAddress: string,
  category: Category,
): string[][] {
  const paths = [];
  for (const e of category.entities) {
    for (const a of e.addresses) {
      if (a.paths) {
        for (const p of a.paths) {
          paths.push(p);
        }
      } else {
        paths.push([originAddress, a.hash]);
      }
    }
  }

  return paths;
}

function getCategoryRisk(category: string): number {
  const categoryClass = CategoryClasses[category];

  if (!categoryClass) {
    return 0;
  }

  return categoryClass.risk;
}

interface LabelsAndTagsProps extends WithAuthProps { }

// Label + Tag + Tag Input Wrapped Component

const LabelsAndTags: FC<LabelsAndTagsProps> = ({ handleActionRequiringAuth }) => {
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
      <div onClick={() => {
        if (!isAuthenticated) {
          sessionStorage.setItem("focusedAddressData", JSON.stringify(analysisData));
          handleActionRequiringAuth({
            pathname: "graph",
          })
        }
      }}>
        <TagInput
          currentAddressTags={addressCustomTags}
          currentUserTags={userCustomTags}
          onCreateCustomAddressTag={onCreateCustomAddressTag}
          onDeleteCustomAddressTag={onDeleteCustomAddressTag}
        />
      </div>
    </span >
  );
};

// Labels and Tags with authentication
// The tag input will only be shown if the user is authenticated
const LabelsAndTagsWithAuth = WithAuth(LabelsAndTags);

// Expand with AI -------------------------------------------------------------
interface ExpandWithAIProps extends WithAuthProps {
  analysisData: AddressAnalysis;
  addMultipleDifferentPaths: (args: PathExpansionArgs[]) => void;
}

const ExpandWithAI: FC<ExpandWithAIProps> = ({
  analysisData,
  addMultipleDifferentPaths,
  handleActionRequiringAuth
}) => {
  const expandWithAI = useCallback((analysisData: AddressAnalysis) => {
    // We'll first do it for incoming and then for outgoing to get balanced results
    const MAX_PATHS = 7; // How many paths for each direction will be shown
    let pathExpansionArgs: PathExpansionArgs[] = [];

    // Compile all categories in the analysisData
    let categories: Category[] = [];
    categories.push(...analysisData.incomingDirectExposure.categories);
    categories.push(...analysisData.incomingIndirectExposure.categories);

    // Now sort the categories by risk, starting from the highest risk
    categories.sort(
      (a, b) => getCategoryRisk(b.name) - getCategoryRisk(a.name),
    );

    // Now iterate through the first categories until at least 15 paths have been added
    for (const category of categories) {
      const paths: string[][] = getCategoryPaths(
        analysisData.address,
        category,
      );

      // If the paths plus the already added paths are more than the max paths, then trim the paths
      const remainingPaths = MAX_PATHS - pathExpansionArgs.length;

      // If no more can be added, just stop
      if (remainingPaths === 0) {
        break;
      }
      pathExpansionArgs.push({
        paths: paths.slice(0, remainingPaths),
        incoming: true,
      });
    }

    // Now do the same for outgoing
    categories = [];
    categories.push(...analysisData.outgoingDirectExposure.categories);
    categories.push(...analysisData.outgoingIndirectExposure.categories);

    // Now sort the categories by risk, starting from the highest risk
    categories.sort(
      (a, b) => getCategoryRisk(b.name) - getCategoryRisk(a.name),
    );

    // Now iterate through the first categories until at least 15 paths have been added
    for (const category of categories) {
      const paths: string[][] = getCategoryPaths(
        analysisData.address,
        category,
      );

      // If the paths plus the already added paths are more than the max paths, then trim the paths
      const remainingPaths = MAX_PATHS * 2 - pathExpansionArgs.length; // *2 because we already added the incoming paths

      // If no more can be added, just stop
      if (remainingPaths === 0) {
        break;
      }
      pathExpansionArgs.push({
        paths: paths.slice(0, remainingPaths),
        incoming: false,
      });
    }

    // Add the paths to the graph
    addMultipleDifferentPaths(pathExpansionArgs);
  }, []);

  return (
    <div className="group flex flex-row items-center justify-center">
      <SparklesIcon
        onClick={() => {
          handleActionRequiringAuth({
            pathname: "graph",
            
          })

          expandWithAI(analysisData!);
          logAnalyticsEvent("expand_addresses_with_AI")
        }}
        className="h-11 w-11 cursor-pointer rounded-md p-1.5 text-indigo-400 transition-all duration-150 ease-in-out hover:bg-indigo-50 "
      />
      <div className="pointer-events-none absolute mb-48 mt-0.5 w-max origin-bottom scale-50 divide-y divide-gray-700 rounded-lg bg-gray-800 px-3 py-3 text-white opacity-0 shadow-sm transition-all duration-300 ease-in-out group-hover:scale-100 group-hover:opacity-100">
        <div className="flex flex-row items-center gap-x-1.5 pb-1">
          <InformationCircleIcon className="h-5 w-5 text-indigo-200" />
          <h1 className="text-base font-semibold leading-7">
            Expand w/AI
          </h1>
        </div>
        <div className="flex max-w-xs flex-col gap-y-1.5 pt-1 text-xs font-normal text-gray-400">
          The AI algorithm will expand based on the following criteria:
          <ul className="flex flex-col gap-y-2 pl-3 text-white">
            <li className="flex flex-row items-center gap-x-1">
              <IdentificationIcon className="h-5 w-5 text-indigo-200" />
              <span className="font-bold">Highest risk</span>categories of
              addresses
            </li>
            <li className="flex flex-row items-center gap-x-1">
              <ArrowsPointingInIcon className="h-5 w-5 text-indigo-200" />
              <span className="font-bold">Most relevant</span> multi-hop
              paths
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Expand with AI with authentication
const ExpandWithAIWithAuth = WithAuth(ExpandWithAI);

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
  const { addMultipleDifferentPaths, deleteNodes } = useContext(GraphContext);
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
          <ExpandWithAIWithAuth analysisData={analysisData!} addMultipleDifferentPaths={addMultipleDifferentPaths} />
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
