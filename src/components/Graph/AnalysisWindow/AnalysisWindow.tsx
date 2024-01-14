import { FC, createContext, useRef, useContext } from "react";

import { GraphContext } from "../Graph";

import Draggable from "react-draggable";
import Header from "./Header";
import Content from "./Content";

import { AddressAnalysis } from "../../../api/model";

interface AnalysisContextProps {
  analysisData: AddressAnalysis | null;
  address: string;
}
export const AnalysisContext = createContext<AnalysisContextProps>({
  analysisData: null,
  address: "",
});

interface DraggableWindowProps {
  analysisData: AddressAnalysis | null;
  setFocusedAddressData: (data: AddressAnalysis | null) => void;
}

const DraggableWindow: FC<DraggableWindowProps> = ({
  analysisData,
  setFocusedAddressData,
}) => {
  if (analysisData === null) {
    return null;
  }

  const contextValue: AnalysisContextProps = {
    analysisData: analysisData,
    address: analysisData.address,
  };

  const nodeRef = useRef(null);

  return (
    <div className="pointer-events-none fixed z-50 h-full w-full">
      <AnalysisContext.Provider value={contextValue}>
        <Draggable nodeRef={nodeRef}>
          <div ref={nodeRef}>
            <div className="pointer-events-auto w-[68rem] scale-75 divide-y divide-dashed divide-gray-200 overflow-hidden rounded-lg bg-white opacity-50 shadow-xl transition-opacity duration-300 hover:opacity-100">
              <div className="px-4 py-5">
                <Header onExit={() => setFocusedAddressData(null)} />
              </div>
              <div className="px-4 py-5">
                <Content />
              </div>
            </div>
          </div>
        </Draggable>
      </AnalysisContext.Provider>
    </div>
  );
};

export default DraggableWindow;
