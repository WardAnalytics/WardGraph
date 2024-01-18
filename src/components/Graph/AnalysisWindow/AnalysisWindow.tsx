import {
  FC,
  createContext,
  useRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import clsx from "clsx";

import Draggable from "react-draggable";
import Content from "./Content";
import Overview from "./Overview";
import Header from "./Header";

import { AddressAnalysis } from "../../../api/model";
import { Transition } from "@headlessui/react";

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

/** The draggable window that appears when an address is clicked on.
 *
 * It features two modes: basic & analysis mode.
 * - **Basic Mode**: Shows a small list of entities that the address is exposed
 * to and that can be expanded.
 * - **Analysis Mode**: Shows a massive list of categories that the address is
 * exposed to and with thorough information.
 *
 * @param analysisData The analysis data of the address that was clicked on
 * @param setFocusedAddressData A function to set the focused address data to null when the window is closed
 * @returns
 */

const DraggableWindow: FC<DraggableWindowProps> = ({
  analysisData,
  setFocusedAddressData,
}) => {
  const [hasBeenHovered, setHasBeenHovered] = useState<boolean>(false);
  const [analysisMode, setAnalysisMode] = useState<boolean>(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    setHasBeenHovered(false);
    if (analysisData === null) {
      setAnalysisMode(false);
    }
  }, [analysisData]);

  const toggleAnalysisMode = useCallback(() => {
    setAnalysisMode(!analysisMode);
    console.log("Analysis mode toggled");
  }, [analysisMode]);

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
                "pointer-events-auto scale-75 divide-y divide-dashed divide-gray-200 rounded-lg bg-white shadow-xl transition-opacity duration-300",
                hasBeenHovered ? "opacity-30 hover:opacity-100" : "opacity-100",
              )}
              style={{
                width: analysisMode ? "68rem" : "40rem",
                transition: "width 0.5s ease-in-out, opacity 0.2s ease-in-out",
              }}
              onMouseEnter={() => setHasBeenHovered(true)}
            >
              <div className="px-4 py-5">
                <Header
                  onExit={() => setFocusedAddressData(null)}
                  toggleAnalysisMode={toggleAnalysisMode}
                  analysisMode={analysisMode}
                />
              </div>
              <div className="overflow-hidden px-4 py-5">
                <Transition
                  appear={true}
                  show={analysisMode}
                  enter="transition-all duration-500"
                  enterFrom="opacity-50 translate-x-1/2"
                  enterTo="opacity-100 translate-x-0"
                  leave="hidden fixed duration-0"
                >
                  <Content />
                </Transition>
                <Transition
                  appear={true}
                  show={!analysisMode}
                  enter="transition-all duration-500"
                  enterFrom="opacity-50 -translate-x-1/2"
                  enterTo="opacity-100 translate-x-0"
                  leave="hidden fixed duration-0"
                >
                  <Overview />
                </Transition>
              </div>
            </div>
          </div>
        </Draggable>
      </AnalysisContext.Provider>
    </div>
  );
};

export default DraggableWindow;
