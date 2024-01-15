import { FC, createContext, useContext, useState, useEffect } from "react";
import clsx from "clsx";
import { Position, Handle, Edge } from "reactflow";

import { AddressAnalysis } from "../../../../../../api/model";
import { useAnalysisAddressData } from "../../../../../../api/compliance/compliance";

import RiskIndicator from "../../../../AnalysisWindow/Header/components/RiskIndicator";
import LabelList from "../../../../AnalysisWindow/Header/components/LabelList";

import { GraphContext } from "../../../../Graph";

import {
  createTransfershipEdge,
  TransfershipEdgeStates,
} from "../../../edges/TransfershipEdge";

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
  };
}

const AddressNode: FC<AddressNodeProps> = ({ data: { address } }) => {
  const { setFocusedAddressData, addEdges, focusedAddressData } =
    useContext(GraphContext);

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
      />
      <Handle
        type="source"
        position={Position.Right}
        className="mb-2 opacity-0"
        id="a"
      />
      {/* Handle B - The edge flows from the right of a node to the left of another */}
      <Handle
        type="target"
        position={Position.Right}
        className="mt-2 opacity-0"
        id="b"
      />
      <Handle
        type="source"
        position={Position.Left}
        className="mt-2 opacity-0"
        id="b"
      />

      <span
        className={clsx(
          "flex flex-row items-center gap-x-2 rounded-lg bg-white px-4 py-5  transition-all duration-150 hover:bg-gray-50",
          focusedAddressData?.address === address
            ? "shadow-2xl shadow-blue-300 ring-4 ring-blue-400"
            : "shadow-md ring-1 ring-gray-300",
        )}
        onClick={() => {
          if (analysisData) {
            setFocusedAddressData(analysisData);
          }
        }}
      >
        {/* Address Risk inside a badge */}
        <RiskIndicator
          risk={analysisData?.risk}
          isLoading={isLoadingAddressData}
        />

        {/* Address information */}
        <div className="flex flex-col gap-y-0.5">
          <h1 className="font-mono font-semibold tracking-tight text-gray-800">
            {`${address.slice(0, 5)}...${address.slice(-5)}`}
          </h1>
          {analysisData && <LabelList labels={analysisData!.labels} />}
        </div>
      </span>
    </AnalysisContext.Provider>
  );
};

export default AddressNode;
