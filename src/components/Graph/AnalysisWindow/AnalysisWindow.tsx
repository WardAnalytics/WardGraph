import { FC, createContext, useRef, useState, useEffect } from "react";
import clsx from "clsx";

import Draggable from "react-draggable";
import Content from "./Content";
import Header from "./Header";

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
  const [hasBeenHovered, setHasBeenHovered] = useState<boolean>(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    setHasBeenHovered(false);
  }, [analysisData]);

  if (analysisData === null) {
    return null;
  }

  const contextValue: AnalysisContextProps = {
    analysisData: analysisData,
    address: analysisData.address,
  };

  return (
    <div className="pointer-events-none fixed z-50 h-full w-full">
      <AnalysisContext.Provider value={contextValue}>
        <Draggable nodeRef={nodeRef}>
          <div ref={nodeRef}>
            <div
              className={clsx(
                "pointer-events-auto w-[68rem] scale-75 divide-y divide-dashed divide-gray-200 rounded-lg bg-white shadow-xl transition-opacity duration-300",
                hasBeenHovered ? "opacity-30 hover:opacity-100" : "opacity-100",
              )}
              onMouseEnter={() => setHasBeenHovered(true)}
            >
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
