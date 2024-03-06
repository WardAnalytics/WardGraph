import {
  FC,
  useState,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import clsx from "clsx";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  ArrowsPointingInIcon,
  ArrowsRightLeftIcon,
  BuildingLibraryIcon,
  IdentificationIcon,
  InformationCircleIcon,
} from "@heroicons/react/16/solid";
import { CheckIcon, PlusIcon, SparklesIcon } from "@heroicons/react/20/solid";
import { Transition } from "@headlessui/react";

import { Category } from "../../../../../api/model";

import { Colors } from "../../../../../utils/colors";
import formatNumber from "../../../../../utils/formatNumber";

import BigButton from "../../../../common/BigButton";
import EntityLogo from "../../../../common/EntityLogo";
import Badge from "../../../../common/Badge";

import { GraphContext } from "../../../Graph";
import { AnalysisContext } from "../../AnalysisWindow";

import "../../../../common/Scrollbar.css";
import { logAnalyticsEvent } from "../../../../../services/firestore/analytics/analytics";
import WithPremium, { WithPremiumProps } from "../../../../premium/WithPremium";
import { AddressAnalysis } from "../../../../../api/model";
import { PathExpansionArgs } from "../../../Graph";
import useAuthState from "../../../../../hooks/useAuthState";
import { useFreeTierExpandWithAIUsage } from "../../../../../services/firestore/user/free_usage";
import getExpandWithAIPaths from "../../../expand_with_ai";
import { addFreeTierExpandWithAIInteraction } from "../../../../../services/firestore/user/free_usage";

/** There can be 3 incoming states for an entity row:
 * - **Outgoing**: The address is sending funds to the entity
 * - **Incoming**: The address is receiving funds from the entity
 * - **Both**: The address is both sending and receiving funds from the entity
 */

enum IncomingState {
  INCOMING,
  OUTGOING,
  BOTH,
}

interface EntityPath {
  paths: string[][];
  incoming: boolean;
}

interface EntityRowProps {
  entity: string;
  totalIncoming: number;
  totalOutgoing: number;
  paths: EntityPath[];
}

function auxIterateCategories(
  address: string,
  categories: Category[],
  entityMap: Map<string, EntityRowProps>,
  incoming: boolean,
) {
  for (const c in categories) {
    for (const e in categories[c].entities) {
      const entity = categories[c].entities[e];

      let entityRow: EntityRowProps | undefined = entityMap.get(entity.name);
      if (!entityRow) {
        entityRow = {
          entity: entity.name,
          totalIncoming: 0,
          totalOutgoing: 0,
          paths: [],
        };
        entityMap.set(entity.name, entityRow);

        if (incoming) entityRow.totalIncoming += entity.quantity;
        else entityRow.totalOutgoing += entity.quantity;

        for (const a in entity.addresses) {
          const addressPaths = entity.addresses[a].paths;
          if (addressPaths) {
            entityRow.paths = entityRow.paths.concat({
              paths: addressPaths,
              incoming: incoming,
            });
          } else {
            entityRow.paths.push({
              paths: [[address, entity.addresses[a].hash]],
              incoming: incoming,
            });
          }
        }
      }
    }
  }
}

/**
 * Displays a row with an entity and its total exposure.
 * @param entity The entity to display
 * @param total The total exposure of the entity
 * @param incoming Whether the entity is incoming, outgoing or both
 * @param percentage The percentage of the entity's exposure compared to the total
 * @param paths The paths that the entity is involved in used to expand the row
 */

const EntityRow: FC<EntityRowProps> = ({
  entity,
  totalIncoming,
  totalOutgoing,
  paths,
}) => {
  // TODO - Import the path expansion method from the graph
  const [expandedPaths, setExpandedPaths] = useState<number>(0);
  const { addAddressPaths } = useContext(GraphContext);
  const { analysisData } = useContext(AnalysisContext);

  // Whenever analysisData changes, reset the expanded paths
  useEffect(() => {
    setExpandedPaths(0);
  }, [analysisData]);

  const expandPath = useCallback(() => {
    if (expandedPaths < paths.length) {
      const newPath = paths[expandedPaths];
      addAddressPaths(newPath.paths, newPath.incoming, 0);
      setExpandedPaths(expandedPaths + 1);
      return;
    }

    console.error("Tried to expand a path that doesn't exist");
  }, [expandedPaths, paths]);

  // Calculate the state: incoming, outgoing or both-ways
  let Icon: any;
  let badgeText: string;

  const { total } = useMemo(() => {
    return {
      total: totalIncoming + totalOutgoing,
    };
  }, [totalIncoming, totalOutgoing]);

  const incoming: IncomingState = useMemo(() => {
    if (totalIncoming > 0) {
      if (totalOutgoing > 0) {
        return IncomingState.BOTH;
      }
      return IncomingState.INCOMING;
    }
    return IncomingState.OUTGOING;
  }, [totalIncoming, totalOutgoing]);

  switch (incoming) {
    case IncomingState.INCOMING:
      Icon = ArrowDownLeftIcon;
      badgeText = "Incoming";
      break;
    case IncomingState.OUTGOING:
      Icon = ArrowUpRightIcon;
      badgeText = "Outgoing";
      break;
    case IncomingState.BOTH:
      Icon = ArrowsRightLeftIcon;
      badgeText = "Both Ways";
      break;
  }

  const { showExpandButton, expandButtonText } = useMemo(() => {
    if (expandedPaths === 0) {
      return {
        showExpandButton: true,
        expandButtonText: "Expand",
      };
    } else if (expandedPaths < paths.length) {
      return {
        showExpandButton: true,
        expandButtonText: `Expand (${expandedPaths}/${paths.length})`,
      };
    } else {
      return {
        showExpandButton: false,
        expandButtonText: "",
      };
    }
  }, [expandedPaths, paths.length]);

  return (
    <div
      onClick={() => {
        if (!showExpandButton) return;
        expandPath();
      }}
      className={clsx(
        "flex w-full flex-row items-center justify-between rounded-md p-2 transition-all duration-100",
        showExpandButton && "hover:cursor-pointer hover:bg-gray-100",
      )}
    >
      <span className="flex flex-row items-center gap-x-3">
        <EntityLogo entity={entity} className="h-12 w-12 rounded-full" />
        <span className="flex flex-col gap-y-1">
          <span className="flex items-center space-x-2">
            <p className=" text-lg font-semibold text-gray-800">{entity}</p>
            <Badge text={badgeText} color={Colors.GRAY} Icon={Icon} />
          </span>

          <div className="flex items-center gap-x-2 text-sm text-gray-500">
            <p>{formatNumber(total)}</p>
            <p>{`(${paths.length} path${paths.length > 1 ? "s" : ""})`}</p>
          </div>
        </span>
      </span>
      {showExpandButton ? (
        <BigButton text={expandButtonText} Icon={PlusIcon} onClick={() => {}} />
      ) : (
        <h3 className="flex flex-row items-center gap-x-1 text-sm font-semibold tracking-wide text-gray-400">
          <CheckIcon className="h-5 w-5 rounded-full  text-gray-400" />
          Expanded
        </h3>
      )}
    </div>
  );
};

interface ExpandWithAIProps extends WithPremiumProps {
  analysisData: AddressAnalysis;
  addMultipleDifferentPaths: (args: PathExpansionArgs[]) => void;
}

const ExpandWithAI: FC<ExpandWithAIProps> = ({
  analysisData,
  addMultipleDifferentPaths,
  handleActionRequiringAuth,
  handleActionRequiringPremium,
}) => {
  const { user } = useAuthState();
  const userID = useMemo(() => (user ? user.uid : ""), [user]);
  const { hasReachedUsageLimit } = useFreeTierExpandWithAIUsage(userID);

  const expandWithAI = useCallback((analysisData: AddressAnalysis) => {
    // Get the paths for the AI to expand
    const paths = getExpandWithAIPaths(analysisData);

    // Add the paths to the graph
    addMultipleDifferentPaths(paths);
  }, []);

  return (
    <button
      onClick={async () => {
        handleActionRequiringAuth({
          pathname: "graph",
        });
        if (hasReachedUsageLimit) {
          handleActionRequiringPremium({
            successPath: "graph",
            cancelPath: "graph",
          });
        }

        await addFreeTierExpandWithAIInteraction(userID);

        expandWithAI(analysisData!);
        logAnalyticsEvent("expand_addresses_with_AI");
      }}
      className="group mr-6 flex h-11 flex-row items-center justify-center gap-x-1.5 rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-900 shadow-md shadow-indigo-500/25 ring-1 ring-inset ring-indigo-300 transition-all ease-in-out hover:bg-indigo-100 hover:shadow-lg hover:shadow-indigo-500/25  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <SparklesIcon className="h-5 w-5 text-indigo-400" />
      Expand w/AI
      <div className="pointer-events-none absolute z-10 mb-0.5 mr-48 mt-48 w-max origin-top scale-50 divide-y divide-gray-700 rounded-lg bg-gray-800 px-3 py-3 text-white opacity-0 shadow-sm transition-all duration-300 ease-in-out group-hover:scale-100 group-hover:opacity-100">
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
              <span className="font-bold">Most relevant</span> multi-hop paths
            </li>
          </ul>
        </div>
      </div>
    </button>
  );
};

// Expand with AI with authentication
const ExpandWithAIWithPremium = WithPremium(ExpandWithAI);

const Overview: FC = () => {
  const focusedAddressData = useContext(GraphContext).focusedAddressData!;

  const { topEntityRows } = useMemo(() => {
    // Create a map of entities to their row
    const entityRows: Map<string, EntityRowProps> = new Map();

    // We'll have to iterate through directIncoming, directOutgoing, indirectIncoming, and indirectOutgoing for each entity, and through each entity for each path
    auxIterateCategories(
      focusedAddressData.address,
      focusedAddressData.incomingDirectExposure.categories,
      entityRows,
      true,
    );
    auxIterateCategories(
      focusedAddressData.address,
      focusedAddressData.outgoingDirectExposure.categories,
      entityRows,
      false,
    );
    auxIterateCategories(
      focusedAddressData.address,
      focusedAddressData.incomingIndirectExposure.categories,
      entityRows,
      true,
    );
    auxIterateCategories(
      focusedAddressData.address,
      focusedAddressData.outgoingIndirectExposure.categories,
      entityRows,
      false,
    );

    const topEntityRows = Array.from(entityRows.values()).sort((a, b) => {
      const sumA = a.totalIncoming + a.totalOutgoing;
      const sumB = b.totalIncoming + b.totalOutgoing;
      return sumB - sumA;
    });

    return {
      topEntityRows: topEntityRows.slice(0, 15),
    };
  }, [focusedAddressData]);

  // TODO - Add a max height and a scrollbar, maybe a slight fade effect to the bottom and top
  return (
    <div className="flex h-full flex-col gap-y-2">
      <span className="flex h-fit w-full flex-row items-end justify-between">
        <h3 className="flex h-fit flex-row items-center gap-x-1 text-sm font-semibold tracking-wide text-gray-600">
          <BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
          TOP ENTITIES
        </h3>
        <ExpandWithAIWithPremium
          analysisData={focusedAddressData}
          addMultipleDifferentPaths={
            useContext(GraphContext).addMultipleDifferentPaths
          }
        />
      </span>
      <ul className="scrollbar flex flex-grow scroll-m-28 flex-col gap-y-1.5 overflow-scroll overflow-x-hidden">
        {topEntityRows.map((row, index) => (
          <Transition
            appear={true}
            show={true}
            enter="transition-all ease-in-out transform duration-300 origin-left"
            enterFrom="-translate-x-10 -translate-y-3 opacity-0 scale-50"
            enterTo="translate-y-0 opacity-100 scale-100"
            leave="transition-all ease-in-out transform duration-300 origin-left"
            leaveFrom="translate-y-0 opacity-100 scale-100"
            leaveTo="-translate-x-10 -translate-y-3 opacity-0 scale-50"
            className="mr-2"
            style={{
              transitionDelay: `${index * (100 - index / 10)}ms`,
            }}
            key={row.entity + focusedAddressData.address}
          >
            <div
              onClick={() => {
                logAnalyticsEvent("expand_address", {
                  page: "overview",
                  address: focusedAddressData.address,
                });
              }}
            >
              <EntityRow
                entity={row.entity}
                totalIncoming={row.totalIncoming}
                totalOutgoing={row.totalOutgoing}
                paths={row.paths}
                key={row.entity + focusedAddressData.address}
              />
            </div>
          </Transition>
        ))}
      </ul>
    </div>
  );
};

export default Overview;
