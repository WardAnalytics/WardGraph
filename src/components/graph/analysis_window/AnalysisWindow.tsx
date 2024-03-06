import { FC, createContext, memo, useRef, useState, useEffect } from "react";
import clsx from "clsx";
import {
  PresentationChartLineIcon,
  EyeIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/20/solid";

import { Transition } from "@headlessui/react";
import Draggable from "react-draggable";

import { Advanced, Transactions, Overview } from "./content";
import Header from "./header/Header";

import { AddressAnalysis } from "../../../api/model";

interface AnalysisContextProps {
  analysisData: AddressAnalysis | null;
  address: string;
}
export const AnalysisContext = createContext<AnalysisContextProps>({
  analysisData: null,
  address: "",
});

export enum AnalysisModeNames {
  Overview = "Overview",
  Advanced = "Advanced",
  Transactions = "Transactions",
}

export interface AnalysisMode {
  name: AnalysisModeNames;
  icon: any;
  component?: FC;
}

export const AnalysisModes: AnalysisMode[] = [
  {
    name: AnalysisModeNames.Overview,
    icon: EyeIcon,
    component: memo(Overview),
  },
  {
    name: AnalysisModeNames.Transactions,
    icon: ArrowsRightLeftIcon,
    component: memo(Transactions),
  },
  {
    name: AnalysisModeNames.Advanced,
    icon: PresentationChartLineIcon,
    component: memo(Advanced),
  },
];

interface DraggableWindowProps {
  analysisData: AddressAnalysis | null;
  onExit: () => void;
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
 * @param onExit Callback that is called when the window is closed
 * @returns
 */

const DraggableWindow: FC<DraggableWindowProps> = ({
  analysisData,
  onExit,
}) => {
  const [hasBeenHovered, setHasBeenHovered] = useState<boolean>(false);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>(
    AnalysisModes[0],
  );
  const [previousAnalysisMode, setPreviousAnalysisMode] =
    useState<AnalysisMode>(analysisMode);
  const nodeRef = useRef(null);

  // When analysisData is none, reset the analysis mode
  useEffect(() => {
    setHasBeenHovered(false);
    if (analysisData === null) {
      setAnalysisMode(AnalysisModes[0]);
    }
  }, [analysisData]);

  // Whenever analysisMode changes, setTimeout to set previousAnalysisMode after 500ms. This is used for the dynamic transition
  useEffect(() => {
    // Whenever currentAnalysisMode changes, update previousAnalysisMode
    // and then set current mode to new mode after a delay
    if (analysisMode !== previousAnalysisMode) {
      setTimeout(() => setPreviousAnalysisMode(analysisMode), 500); // Adjust delay based on transition duration
    }
  }, [analysisMode]);

  // Function to determine transition classes based on direction
  function getTransactionClasses(mode: AnalysisMode, leaving: boolean = false) {
    const currentIndex = AnalysisModes.findIndex((m) => m === mode);
    const previousIndex = AnalysisModes.findIndex(
      (m) => m === previousAnalysisMode,
    );

    // If increasing the mode index, we want the leaving component to go to the left and the entering component to come from the right - transition-all duration-500 opacity-0 translate-x-full
    // If decreasing the mode index, we want the leaving component to go to the right and the entering component to come from the left - transition-all duration-500 opacity-0 -translate-x-full

    if (currentIndex > previousIndex) {
      return leaving
        ? "transition-all duration-500 opacity-0 -translate-x-full"
        : "transition-all duration-500 opacity-0 translate-x-full";
    } else {
      return leaving
        ? "transition-all duration-500 opacity-0 translate-x-full"
        : "transition-all duration-500 opacity-0 -translate-x-full";
    }
  }

  // If no analysis data, don't show the window
  if (analysisData === null) {
    return null;
  }

  const contextValue: AnalysisContextProps = {
    analysisData: analysisData,
    address: analysisData.address,
  };

  return (
    <div className="pointer-events-none fixed z-10 h-full w-full">
      <AnalysisContext.Provider value={contextValue}>
        <Draggable nodeRef={nodeRef}>
          <div ref={nodeRef}>
            <div
              className={clsx(
                "pointer-events-auto flex h-[50rem] scale-75 flex-col divide-y divide-dashed divide-gray-200 rounded-lg bg-white shadow-xl transition-opacity duration-300",
                hasBeenHovered ? "opacity-30 hover:opacity-100" : "opacity-100",
              )}
              style={{
                width:
                  analysisMode.name === AnalysisModeNames.Advanced
                    ? "68rem"
                    : "61rem",
                transition: "width 0.5s ease-in-out, opacity 0.2s ease-in-out",
              }}
              onMouseEnter={() => {
                if (!hasBeenHovered) {
                  setHasBeenHovered(true);
                }
              }}
            >
              <div className="h-fit flex-none px-4 py-5">
                <Header
                  onExit={onExit}
                  setAnalysisMode={setAnalysisMode}
                  analysisMode={analysisMode}
                />
              </div>
              <div className="relative flex-auto overflow-hidden">
                {AnalysisModes.map((mode) => (
                  <Transition
                    key={mode.name}
                    appear={true}
                    show={analysisMode === mode}
                    enter="transition-all duration-500"
                    enterFrom={getTransactionClasses(analysisMode, false)}
                    enterTo="opacity-100 translate-x-0"
                    leave="transition-all duration-500"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo={getTransactionClasses(analysisMode, true)}
                    className="absolute h-full w-full p-4"
                  >
                    {mode.component ? <mode.component /> : null}
                  </Transition>
                ))}
              </div>
            </div>
          </div>
        </Draggable>
      </AnalysisContext.Provider>
    </div>
  );
};

export default DraggableWindow;
