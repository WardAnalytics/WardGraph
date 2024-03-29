import { FC } from "react";
import {
  ChevronDoubleDownIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/16/solid";

import { DirectExposure, IndirectExposure } from "./tabs";

/** Each Tab represents a tab within the content of the analysis window.
 * Each tab has: a name, an index, an icon, and a component that
 * gets displayed when the tab is selected
 *
 * @param name: The name of the tab
 * @param Icon: The icon of the tab
 * @param component: The component to display when the tab is selected
 */

export interface Tab {
  name: string;
  Icon: any;
  component?: FC;
}

/* Tabs get defined here:
    1. Direct Exposure
    2. Indirect Exposure
    3. Transactions
    4. Triggers
*/

const DirectExposureTab: Tab = {
  name: "Direct Exposure",
  Icon: ArrowsPointingInIcon,
  component: DirectExposure,
};

const IndirectExposureTab: Tab = {
  name: "Indirect Exposure",
  Icon: ChevronDoubleDownIcon,
  component: IndirectExposure,
};

/* Tabs for each blockchain: Not all blockchains support the same tabs.
    Ethereum: Direct Exposure, Indirect Exposure
    Bitcoin: Direct Exposure
*/

const EthereumTabs: Tab[] = [DirectExposureTab, IndirectExposureTab];

const BitcoinTabs: Tab[] = [DirectExposureTab];

export const BLOCKCHAIN_TABS: Record<string, Tab[]> = {
  Ethereum: EthereumTabs,
  Bitcoin: BitcoinTabs,
};
