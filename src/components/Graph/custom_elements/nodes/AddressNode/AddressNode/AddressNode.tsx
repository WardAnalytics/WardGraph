import { FC, createContext, useContext, useState, useEffect } from "react";
import clsx from "clsx";
import { Position, Handle, Edge } from "reactflow";

import { AddressAnalysis } from "../../../../../../api/model";
import { useAnalysisAddressData } from "../../../../../../api/compliance/compliance";

import EntityLogo from "../../../../../common/EntityLogo";
import RiskIndicator from "../../../../../common/RiskIndicator";
import LabelList from "../../../../../common/LabelList";

import { GraphContext } from "../../../../Graph";

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

const AddressNode: FC<AddressNodeProps> = ({
  data: { address, highlight },
}) => {
  const {
    setFocusedAddressData,
    addEdges,
    focusedAddressData,
    setNodeHighlight,
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
            "1transition-all flex flex-row items-center gap-x-2 rounded-lg bg-white px-4 py-5 ring-1 duration-150 hover:bg-gray-50",
            focusedAddressData?.address === address
              ? " scale-125 bg-blue-50 shadow-2xl shadow-blue-300 ring-4 ring-blue-400"
              : highlight
                ? "shadow-xl shadow-blue-200 ring-blue-300"
                : "shadow-md ring-gray-300",
          )}
          onClick={() => {
            if (analysisData) {
              setFocusedAddressData(analysisData);
            }
          }}
          onMouseEnter={() => {
            // When the mouse enters the node, the node is no longer highlighted
            setNodeHighlight(address, false);
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
            {analysisData && <LabelList labels={analysisData!.labels} />}
          </div>
        </span>
      </Transition>
    </AnalysisContext.Provider>
  );
};

export default AddressNode;
