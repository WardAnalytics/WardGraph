import clsx from "clsx";
import { FC } from "react";
import { LockClosedIcon } from "@heroicons/react/20/solid";

import { Tab } from "./Tab";

interface TabButtonNoComponentProps {
  tab: Tab;
}

const TabButtonNoComponent: FC<TabButtonNoComponentProps> = ({ tab }) => {
  return (
    <div
      key={tab.name}
      className={`group flex space-x-3 text-sm font-semibold`}
    >
      <a
        key={tab.name}
        className="group inline-flex items-center space-x-2 px-1 text-sm font-medium text-gray-200"
        aria-current={"page"}
      >
        <LockClosedIcon className="h-5 w-5 text-gray-200" aria-hidden="true" />
        {tab.name}
      </a>
    </div>
  );
};

interface TabButtonProps {
  tab: Tab;
  isSelected: boolean;
  isCollapsed: boolean;
  setSelectedTab: () => void;
}

/** This component is a button for switching between the different tabs
 * and displaying the name & icon of the tab.
 *
 * @param tab: the tab to display
 * @param selectedTab: the index of the currently selected tab
 * @param setSelectedTab: function to set the selected tab
 */

const TabButton: FC<TabButtonProps> = ({
  tab,
  isSelected,
  setSelectedTab,
  isCollapsed,
}) => {
  return (
    <div
      key={tab.name}
      className={`${isSelected ? "bg-gray-50" : ""} group flex ${
        tab.component ? "cursor-pointer" : ""
      } hover:bg-gray-50" : "bg-gray-200"} space-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-all duration-100`}
      onClick={tab.component ? () => setSelectedTab() : undefined}
    >
      {tab.component ? (
        <a
          key={tab.name}
          className={clsx(
            isSelected ? "text-blue-600" : " text-gray-500 hover:text-gray-700",
            "group inline-flex items-center space-x-2 px-1 text-sm font-medium",
          )}
          aria-current={isSelected ? "page" : undefined}
        >
          <>
            <tab.Icon
              className={clsx(
                isSelected
                  ? "text-indigo-500"
                  : "text-gray-400 group-hover:text-gray-500",
                "h-5 w-5",
              )}
              aria-hidden="true"
            />
            {isCollapsed ? null : <span>{tab.name}</span>}
          </>
        </a>
      ) : (
        <TabButtonNoComponent tab={tab} />
      )}
    </div>
  );
};

interface NavbarProps {
  tabs: Tab[];
  selectedTab: number;
  setSelectedTab: (index: number) => void;
}

/** This component is the navbar on the left of the content part.
 * It allows the user to navigate between the different tabs like the indirect
 * exposure, direct, transactions, and entities.
 *
 * @param blockchain: The blockchain of the address
 * @param selectedTab: The index of the currently selected tab
 * @param setSelectedTab: The function to set the selected tab
 */

const Navbar: FC<NavbarProps> = ({ tabs, selectedTab, setSelectedTab }) => {
  return (
    <nav className="nodrag inline-block" aria-label="Tabs">
      {tabs.map((tab, index) => (
        <TabButton
          key={tab.name}
          tab={tab}
          isSelected={selectedTab === index}
          isCollapsed={false}
          setSelectedTab={() => setSelectedTab(index)}
        />
      ))}
    </nav>
  );
};

export default Navbar;
