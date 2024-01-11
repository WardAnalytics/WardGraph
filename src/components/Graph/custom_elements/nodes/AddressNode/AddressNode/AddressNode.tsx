import clsx from "clsx";
import { FC, createContext, useContext, useEffect, useState } from "react";

import { useAnalysisAddressData } from "../../../../../../api/compliance/compliance";
import { AddressAnalysis } from "../../../../../../api/model";

import { GraphContext } from "../../../../Graph";

import AddressNodeStates from "../states";
import Header from "./Header";
// import Content from "./Content";

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
  const { focusOnAddress } = useContext(GraphContext);

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
            console.log("Address Analysis Data: ", data);
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
      <div
        className={clsx(
          "rounded-lg bg-white transition-all duration-200",
          state === AddressNodeStates.EXPANDED &&
            "divide-y divide-dashed divide-gray-200 overflow-hidden shadow",
          state === AddressNodeStates.MINIMIZED &&
            "shadow-md ring-1 ring-gray-300  hover:bg-gray-50",
        )}
        style={{
          minWidth: state === AddressNodeStates.EXPANDED ? "50rem" : "10rem",
          marginLeft: state === AddressNodeStates.EXPANDED ? "-10rem" : "0rem",
          transition: "all 0.3s ease-in-out",
        }}
        onClick={() => {
          focusOnAddress(address);
        }}
      >
        <div className="px-4 py-5">
          <Header state={state} />
        </div>
        {/* <Transition
          appear={true}
          show={state === AddressNodeStates.EXPANDED}
          enter="transition-all ease-in-out duration-250"
          enterFrom="-translate-x-10 opacity-5"
          enterTo="translate-x-0 opacity-100"
          leave="duration-0 hidden"
          className="px-4 py-5"
        >
          <Content />
        </Transition> */}
      </div>
    </AnalysisContext.Provider>
  );
};

export default AddressNode;
