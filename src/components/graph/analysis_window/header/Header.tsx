import {
  InformationCircleIcon,
  ArrowsPointingInIcon,
  IdentificationIcon,
} from "@heroicons/react/20/solid";

import { XMarkIcon, SparklesIcon } from "@heroicons/react/24/solid";

import { TrashIcon } from "@heroicons/react/24/outline";

import { XMarkIcon as XMarkSmallIcon } from "@heroicons/react/16/solid";

import clsx from "clsx";
import { FC, useContext, useCallback, useState, useEffect } from "react";

import { AddressAnalysis, Category } from "../../../../api/model";
import { CategoryClasses } from "../../../../utils/categories";

import {
  addCustomAddressTag,
  useCustomAddressTags,
  removeCustomAddressTag,
  useCustomUserTags,
  addCustomUserTag,
} from "../../../../services/firestore/user/custom_tags/";

import { Colors } from "../../../../utils/colors";

import EntityLogo from "../../../common/EntityLogo";
import BlockExplorerAddressIcon from "../../../common/utility_icons/BlockExplorerAddressIcon";
import CopyToClipboardIcon from "../../../common/utility_icons/CopyToClipboardIcon";
import Badge from "../../../common/Badge";
import RiskIndicator from "../../../common/RiskIndicator";

import { AnalysisContext } from "../AnalysisWindow";
import { GraphContext } from "../../Graph";
import { AnalysisMode, AnalysisModes } from "../AnalysisWindow";

import { PathExpansionArgs } from "../../Graph";

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
      <a
        className="w-fit overflow-hidden"
        style={{
          maxWidth: isActive ? "5rem" : "0px",
          opacity: isActive ? 1 : 0,
          transition: "all 0.3s ease-in-out",
        }}
      >
        {analysisMode.name}
      </a>
    </button>
  );
};

interface ModeToggleProps {
  analysisMode: AnalysisMode;
  setAnalysisMode: (mode: AnalysisMode) => void;
}

const ModeToggle: FC<ModeToggleProps> = ({ analysisMode, setAnalysisMode }) => {
  return (
    <span className="flex flex-row gap-x-0.5 rounded-md bg-gray-100 p-1 shadow-inner ring-1 ring-inset ring-gray-300">
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

// Label + Tag + Tag Input Wrapped Component

interface LabelsAndTagsProps {
  setNodeCustomTags: null | ((tags: string[]) => void);
}

const LabelsAndTags: FC<LabelsAndTagsProps> = ({ setNodeCustomTags }) => {
  const { analysisData, address } = useContext(AnalysisContext);

  // Labels get displayed first in the flex-wrap
  const labels = analysisData!.labels;

  // Get user and address already existing tags from Firestore
  const { tags: userCustomTags } = useCustomUserTags();
  const { tags: addressCustomTags } = useCustomAddressTags({ address });

  // Handlers for both creating and deleting tags
  const onCreateCustomAddressTag = useCallback(
    async (tag: string) => {
      // TODO - Catch not authenticated errors and show the auth dialog instead
      addCustomAddressTag(address, tag);
      addCustomUserTag(tag);
    },
    [addressCustomTags, userCustomTags],
  );

  const onDeleteCustomAddressTag = useCallback(
    async (tag: string) => {
      // TODO - Catch not authenticated errors and show the auth dialog instead
      removeCustomAddressTag(address, tag);
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
      <TagInput
        currentAddressTags={addressCustomTags}
        currentUserTags={userCustomTags}
        onCreateCustomAddressTag={onCreateCustomAddressTag}
        onDeleteCustomAddressTag={onDeleteCustomAddressTag}
      />
    </span>
  );
};

interface HeaderProps {
  onExit: () => void;
  setAnalysisMode: (mode: AnalysisMode) => void;
  analysisMode: AnalysisMode;
  setNodeCustomTags: null | ((tags: string[]) => void);
}

const Header: FC<HeaderProps> = ({
  onExit,
  setAnalysisMode,
  analysisMode,
  setNodeCustomTags,
}: HeaderProps) => {
  // Extract analysisData from context
  const { addMultipleDifferentPaths, deleteNodes } = useContext(GraphContext);
  const { analysisData, address } = useContext(AnalysisContext);

  // When minimized, the address hash should be sliced off
  const displayedAddress = address.slice(0, 8) + "..." + address.slice(-6);
  const risk = analysisData!.risk;

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
            <LabelsAndTags setNodeCustomTags={setNodeCustomTags} />
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
          <a className="group flex flex-row items-center justify-center">
            <SparklesIcon
              onClick={() => {
                expandWithAI(analysisData!);
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
                    <a className="font-bold">Most relevant</a> multi-hop paths
                  </li>
                </ul>
              </div>
            </div>
          </a>
          <a className="group flex flex-row items-center justify-center">
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
          </a>
          <a className="group flex flex-row items-center justify-center">
            <XMarkIcon
              onClick={onExit}
              className="h-11 w-11 cursor-pointer rounded-md p-1.5 text-gray-400 transition-all duration-150 ease-in-out hover:bg-gray-100"
            />
            <div className="pointer-events-none absolute mb-24 mt-0.5 w-max origin-bottom scale-50 divide-y divide-gray-700 rounded-lg bg-gray-800 px-3 py-3 text-white opacity-0 shadow-sm transition-all duration-300 ease-in-out group-hover:scale-100 group-hover:opacity-100">
              Close
            </div>
          </a>
        </span>
      </span>
    </span>
  );
};

export default Header;
