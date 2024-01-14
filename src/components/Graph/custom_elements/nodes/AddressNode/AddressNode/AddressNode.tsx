import { FC, createContext, useContext, useState, useEffect } from "react";
import clsx from "clsx";
import { Position, Handle, Edge } from "reactflow";
import { Transition } from "@headlessui/react";

import { AddressAnalysis } from "../../../../../../api/model";
import { useAnalysisAddressData } from "../../../../../../api/compliance/compliance";

import { GraphContext } from "../../../../Graph";

import AddressNodeStates from "../states";
import Header from "./Header";
import Content from "./Content";

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
    state: AddressNodeStates;
  };
}

const AddressNode: FC<AddressNodeProps> = ({ data: { address, state } }) => {
  const { focusOnAddress, addEdges } = useContext(GraphContext);

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

      <div
        className={clsx(
          "rounded-lg bg-white transition-all duration-300",
          state === AddressNodeStates.EXPANDED &&
            "divide-y divide-dashed divide-gray-200 overflow-hidden shadow",
          state === AddressNodeStates.MINIMIZED &&
            "shadow-md ring-1  ring-gray-300 hover:bg-gray-50",
        )}
        style={{
          minWidth: state === AddressNodeStates.EXPANDED ? "68rem" : "15rem",
          maxWidth: state === AddressNodeStates.EXPANDED ? "68rem" : "30rem",
          minHeight: state === AddressNodeStates.EXPANDED ? "10rem" : "0rem",
          maxHeight: state === AddressNodeStates.EXPANDED ? "150rem" : "10rem",
          marginLeft: state === AddressNodeStates.EXPANDED ? "-25rem" : "0rem",
          transition: "all 0.5s ease-in-out",
        }}
        onClick={() => {
          if (state === AddressNodeStates.MINIMIZED) focusOnAddress(address);
        }}
      >
        <div className="px-4 py-5">
          <Header state={state} />
        </div>
        <Transition
          appear={true}
          show={state === AddressNodeStates.EXPANDED}
          enter="transition-all ease-in-out duration-250"
          enterFrom="-translate-x-10 opacity-5"
          enterTo="translate-x-0 opacity-100"
          leave="duration-0 hidden"
          className="px-4 py-5"
        >
          <Content />
        </Transition>
      </div>
    </AnalysisContext.Provider>
  );
};

export default AddressNode;
