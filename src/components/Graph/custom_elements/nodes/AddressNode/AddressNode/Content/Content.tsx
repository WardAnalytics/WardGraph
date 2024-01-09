import { FC, useState, useContext } from "react";
import { Transition } from "@headlessui/react";

import { BLOCKCHAIN_TABS, Tab } from "./Tab";

import Navbar from "./Navbar";

import { AnalysisContext } from "../AnalysisWindow";

interface AllContentComponentsProps {
  tabs: Tab[];
  selectedTab: number;
}

/** This component displays all the content components on the left of
 * the content Component at the same time. It uses HeadlessUI Transitions
 * to animate the components when they are selected.
 *
 * @param tabs: The tabs to display
 * @param selectedTab: The index of the currently selected tab
 */

const AllContentComponents: FC<AllContentComponentsProps> = ({
  tabs,
  selectedTab,
}: AllContentComponentsProps) => {
  return (
    <div className="h-full">
      {tabs.map((tab, index) => (
        <div key={tab.name} className="top-0 flex flex-col">
          <Transition
            appear={true}
            show={selectedTab === index}
            enter="transition-all ease-in-out duration-250"
            enterFrom="-translate-x-10 opacity-5"
            enterTo="translate-x-0 opacity-100"
            leave="duration-0 hidden"
          >
            {tab.component !== undefined ? <tab.component /> : null}
          </Transition>
        </div>
      ))}
    </div>
  );
};

/** This component is the content part of the analysis window.
 * It has a navbar and its right div can switch between the different tabs,
 * changing the content dynamically.
 *
 */

const Content: FC = () => {
  const { analysisData } = useContext(AnalysisContext)!;

  // Currently selected. When a tab is clicked, this is set to the index of the tab
  const tabs = BLOCKCHAIN_TABS[analysisData.blockchain];
  const [selectedTab, setSelectedStep] = useState(0);

  return (
    <div className="nodrag flex divide-x divide-dashed divide-gray-200">
      <div className="lg:w-1/5">
        <div className="pr-3">
          <Navbar
            selectedTab={selectedTab}
            setSelectedTab={setSelectedStep}
            tabs={tabs}
          />
        </div>
      </div>
      <div className="w-full pl-3">
        <AllContentComponents tabs={tabs} selectedTab={selectedTab} />
      </div>
    </div>
  );
};

export default Content;
