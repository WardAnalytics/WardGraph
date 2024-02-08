import {
  ArrowsPointingInIcon,
  IdentificationIcon,
  InformationCircleIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";

import EntityLogo from "../../common/EntityLogo";
import LabelList from "../../common/LabelList";
import RiskIndicator from "../../common/RiskIndicator";
import BlockExplorerAddressIcon from "../../common/utility_icons/BlockExplorerAddressIcon";
import CopyToClipboardIcon from "../../common/utility_icons/CopyToClipboardIcon";

import { AddressAnalysis, Category } from "../../../api/model";
import { GraphContext } from "../Graph";
import { AnalysisContext, AnalysisMode, AnalysisModes } from "./AnalysisWindow";

import { PathExpansionArgs } from "../Graph";

import { deleteCustomAddressTag, getCustomAddressesTags, storeCustomAddressesTags } from "../../../services/firestore/graph/addresses/custom-tags";
import { getCustomUserTags, storeCustomUserTags } from "../../../services/firestore/user/custom-tags";
import { CategoryClasses } from "../../../utils/categories";
import TagInput from "../../common/TagInput";
import TagList from "../../common/TagList";

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
  const { addMultipleDifferentPaths } = useContext(GraphContext);
  const { analysisData, address } = useContext(AnalysisContext);
  const [userCustomAddressTags, setUserCustomAddressTags] = useState<string[]>([]);
  const [addressCustomTags, setAddressCustomTags] = useState<string[]>([]);

  // Filtered values without the tags that are already in the address
  const filteredUserCustomAddressTags = useMemo(() => {
    return userCustomAddressTags.filter((tag) => !addressCustomTags.includes(tag));
  }, [address, userCustomAddressTags, addressCustomTags]);

  // When minimized, the address hash should be sliced off
  const displayedAddress = address.slice(0, 8) + "..." + address.slice(-6);
  const risk = analysisData!.risk;

  const addCustomTag = useCallback((tag: string) => {
    if (!userCustomAddressTags.includes(tag)) {
      const newUserCustomAddressTags = [...userCustomAddressTags, tag];
      storeCustomUserTags(newUserCustomAddressTags);
      setUserCustomAddressTags(newUserCustomAddressTags);
    }

    const newAddressCustomTags = [...addressCustomTags, tag];

    setAddressCustomTags(newAddressCustomTags);
    storeCustomAddressesTags(address, newAddressCustomTags);

  }, [address, addressCustomTags, userCustomAddressTags]);

  const deleteCustomTag = useCallback((tag: string) => {

    setAddressCustomTags(addressCustomTags.filter((t) => t !== tag));
    deleteCustomAddressTag(address, tag);
  }, [address, addressCustomTags]);

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

    console.log("Expanding the following paths: ", pathExpansionArgs);

    // Add the paths to the graph
    addMultipleDifferentPaths(pathExpansionArgs);
  }, []);

  useEffect(() => {
    getCustomUserTags().then((tags) => {
      console.log("Custom tags: ", tags);
      setUserCustomAddressTags(tags);
    });
  }, []);

  useEffect(() => {
    getCustomAddressesTags(address).then((tags) => {
      console.log("Custom address tags: ", tags);
      setAddressCustomTags(tags);
    });
  }, [address]);

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
          <span className="flex w-60 flex-row items-center justify-start gap-x-1.5">
            {/* List of labels using Badges shown underneath the address. */}
            <LabelList labels={analysisData!.labels} />
            <TagList tags={addressCustomTags} onDeletTag={deleteCustomTag} />
          </span>
          <TagInput
            options={filteredUserCustomAddressTags}
            addressCustomTags={addressCustomTags}
            onCreateCustomAddressTag={addCustomTag}
          />
        </div>
      </span>

      {/* Exit button */}
      <span className="flex flex-row items-center gap-x-1.5">
        {/* Mode Toggle */}
        <ModeToggle
          analysisMode={analysisMode}
          setAnalysisMode={setAnalysisMode}
        />
        <button
          type="button"
          className="text-md group flex flex-row items-center justify-center gap-x-1.5 rounded-md bg-purple-50 px-3 py-2.5 font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-200 transition-all duration-300 hover:shadow-lg  hover:shadow-indigo-200/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          onClick={() => {
            expandWithAI(analysisData!);
          }}
        >
          <SparklesIcon
            className="h-6 w-6 text-indigo-400 "
            aria-hidden="true"
          />
          Expand
          <div className="pointer-events-none absolute mb-48 mt-0.5 w-max origin-bottom scale-0 divide-y divide-gray-700 rounded-lg bg-gray-800 px-3 py-3 text-white opacity-0 shadow-sm transition-all duration-300 ease-in-out group-hover:scale-100 group-hover:opacity-100 dark:bg-gray-700 ">
            <div className="flex flex-row items-center gap-x-1.5 pb-1">
              <InformationCircleIcon className="h-5 w-5 text-indigo-200" />
              <h1 className="text-base font-semibold leading-7">Expand w/AI</h1>
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
        </button>
        <a
          onClick={() => {
            onExit();
          }}
        >
          <XMarkIcon className="h-11 w-11 cursor-pointer rounded-full p-1.5 text-gray-400 transition-all duration-300 hover:bg-gray-100" />
        </a>
      </span>
    </span>
  );
};

export default Header;
