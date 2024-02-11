import {
  FC,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import clsx from "clsx";
import { Position, Handle, Edge } from "reactflow";

import { AddressAnalysis } from "../../../../../../api/model";
import { useAnalysisAddressData } from "../../../../../../api/compliance/compliance";

import { getCustomAddressesTags } from "../../../../../../services/firestore/custom_tags/address_tags";

import EntityLogo from "../../../../../common/EntityLogo";
import RiskIndicator from "../../../../../common/RiskIndicator";

import { GraphContext } from "../../../../Graph";

import Badge from "../../../../../common/Badge";
import { Colors } from "../../../../../../utils/colors";

import {
  createTransfershipEdge,
  TransfershipEdgeStates,
} from "../../../edges/TransfershipEdge";
import { Transition } from "@headlessui/react";

/** Context data for the AddressNode */

interface AnalysisContextProps {
  analysisData: AddressAnalysis | null;
  isLoading: boolean;
  address: string;
}
export const AnalysisContext = createContext<AnalysisContextProps>({
  analysisData: null,
  isLoading: true,
  address: "",
});

interface AddressNodeProps {
  data: {
    address: string;
    highlight: boolean;
    state: string;
  };
}

interface LabelsAndTagsProps {
  labels: string[];
  tags: string[];
}

const LabelsAndTags: FC<LabelsAndTagsProps> = ({ labels, tags }) => {
  // Display everything and user input at the end in a flex-wrap
  return (
    <span className="flex max-w-md flex-wrap items-center gap-x-1.5 gap-y-1">
      {labels.map((label) => (
        <Badge key={label} color={Colors.BLUE} text={label} />
      ))}
      {tags.map((tag) => (
        <Badge key={tag} color={Colors.PURPLE} text={tag} />
      ))}
    </span>
  );
};

const AddressNode: FC<AddressNodeProps> = ({
  data: { address, highlight },
}) => {
  const {
    setFocusedAddressData,
    storeSetNodeCustomTags,
    addEdges,
    focusedAddressData,
    setNodeHighlight,
    registerAddressRisk,
    isRiskVision,
  } = useContext(GraphContext);

  // Analysis data is fetched into a useState hook from the Ward API using the Orval Hook and then passed into the context
  const [analysisData, setAnalysisData] = useState<AddressAnalysis | null>(
    null,
  );
  const { isLoading: isLoadingAddressData, refetch: getAddressData } =
    useAnalysisAddressData(
      {
        address: address,
      },
      {
        query: {
          enabled: false,
          refetchOnWindowFocus: false,
          retry: true,

          cacheTime: 1000, // 1 second
          staleTime: 1000, // 1 second

          onSuccess: (data) => {
            setAnalysisData(data);
            registerAddressRisk(address, data.risk);

            let newEdges: Edge[] = [];
            for (const c in data.incomingDirectExposure.categories) {
              const category = data.incomingDirectExposure.categories[c];
              for (const e in category.entities) {
                const entity = category.entities[e];
                for (const a in entity.addresses) {
                  const incomingAddress = entity.addresses[a];
                  newEdges.push(
                    createTransfershipEdge(
                      incomingAddress.hash,
                      address,
                      TransfershipEdgeStates.HIDDEN,
                      incomingAddress.quantity,
                    ),
                  );
                }
              }
            }
            for (const c in data.outgoingDirectExposure.categories) {
              const category = data.outgoingDirectExposure.categories[c];
              for (const e in category.entities) {
                const entity = category.entities[e];
                for (const a in entity.addresses) {
                  const outgoingAddress = entity.addresses[a];
                  newEdges.push(
                    createTransfershipEdge(
                      address,
                      outgoingAddress.hash,
                      TransfershipEdgeStates.HIDDEN,
                      outgoingAddress.quantity,
                    ),
                  );
                }
              }
            }
            addEdges(newEdges);
          },
        },
      },
    );

  // The first time a node is created, the address data is fetched
  useEffect(() => {
    getAddressData();
  }, []);

  // Get the tags of the address
  const [tags, setTags] = useState<string[]>([]);
  async function fetchAddressTags(address: string) {
    getCustomAddressesTags(address).then((tags) => {
      setTags(tags);
    });
  }
  useEffect(() => {
    fetchAddressTags(address);
  }, [address]);

  // Callback for setting the tags
  const tagSetter = useCallback((tags: string[]) => {
    if (tags === null || tags === undefined) {
      const error: Error = new Error("Tags are null or undefined");
      console.error(error.stack);
      return;
    }

    setTags(tags);
  }, []);

  // Based on the risk of the node, the color of the node for risk vision should change
  let { riskColor } = useMemo(() => {
    if (!isRiskVision || !analysisData)
      return { riskColor: "bg-white hover:bg-gray-50" };
    if (analysisData.risk >= 9)
      // Severe risk
      return {
        riskColor:
          "bg-red-200 hover:bg-red-200 ring-red-300 text-red-500 shadow-red-500/50 shadow-xl",
      };
    if (analysisData.risk >= 6)
      // High risk
      return {
        riskColor:
          "bg-orange-100 hover:bg-orange-200 ring-orange-300 text-orange-500 shadow-orange-300/50 shadow-xl",
      };
    if (analysisData.risk >= 3)
      // Medium risk
      return {
        riskColor:
          "bg-yellow-50 hover:bg-yellow-100 ring-yellow-200 text-yellow-500 shadow-yellow-200/10",
      };
    return {
      // Low risk
      riskColor:
        "bg-green-50 hover:bg-green-100 ring-green-200 text-green-500 shadow-green-200/10",
    };
  }, [analysisData, isRiskVision]);

  // Context data is set to the analysis data
  const contextData = {
    analysisData,
    isLoading: isLoadingAddressData,
    address,
  };

  return (
    <AnalysisContext.Provider value={contextData}>
      {/* Handle A - The edge flows from the left of a node to the right of another */}
      <Handle
        type="target"
        position={Position.Left}
        className="mb-2 opacity-0"
        id="a"
        isConnectable={false}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="mb-2 opacity-0"
        id="a"
        isConnectable={false}
      />
      {/* Handle B - The edge flows from the right of a node to the left of another */}
      <Handle
        type="target"
        position={Position.Right}
        className="mt-2 opacity-0"
        id="b"
        isConnectable={false}
      />
      <Handle
        type="source"
        position={Position.Left}
        className="mt-2 opacity-0"
        id="b"
        isConnectable={false}
      />

      <Transition
        appear={true}
        show={true}
        enter="transition-all duration-250"
        enterFrom="opacity-0 scale-50"
        enterTo="opacity-100 scale-100"
      >
        <span
          className={clsx(
            "flex flex-row items-center gap-x-2 rounded-lg px-4 py-5 ring-1 transition-all duration-150",
            riskColor,
            focusedAddressData?.address === address
              ? " scale-125 bg-blue-50 shadow-2xl shadow-blue-300 ring-4 ring-blue-400"
              : highlight
                ? "shadow-xl shadow-blue-200 ring-blue-300"
                : "shadow-md ring-gray-300",
          )}
          onClick={() => {
            if (analysisData) {
              storeSetNodeCustomTags(() => tagSetter);
              setFocusedAddressData(analysisData);
            }
          }}
          onMouseEnter={() => {
            // When the mouse enters the node, the node is no longer highlighted
            if (highlight) setNodeHighlight(address, false);
          }}
        >
          {/* Address Risk inside a badge */}
          <RiskIndicator
            risk={analysisData?.risk}
            isLoading={isLoadingAddressData}
          />

          {/* Address information */}
          <div className="flex flex-col gap-y-0.5">
            <h1 className="flex flex-row font-mono font-semibold tracking-tight text-gray-800">
              {`${address.slice(0, 5)}...${address.slice(-5)}`}
              {analysisData && analysisData.labels.length > 0 && (
                <EntityLogo
                  entity={analysisData!.labels[0]}
                  className="ml-2 h-7 w-7 rounded-full"
                />
              )}
            </h1>
            {analysisData && (
              <LabelsAndTags labels={analysisData.labels} tags={tags} />
            )}
          </div>
        </span>
      </Transition>
    </AnalysisContext.Provider>
  );
};

export default AddressNode;
