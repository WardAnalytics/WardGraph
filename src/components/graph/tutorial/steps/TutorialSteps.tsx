/**
 * @module TutorialSteps
 *
 * @description This module exports a list of tutorial steps for the Ward Graph tutorial. Each step is a React component that is displayed in the tutorial dialog.
 * To add a new step, create a new component and add it to the list of tutorial steps at the bottom of the file.
 */

import { FC } from "react";
import {
  TutorialCardList,
  TutorialCardParagraph,
  TutorialCardTitle,
  TutorialImage,
  TutorialVideo,
} from "../components";

import {
  ArrowTrendingUpIcon,
  ArrowsRightLeftIcon,
  BookmarkIcon,
  BugAntIcon,
  EyeIcon,
  FireIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  PresentationChartLineIcon,
  QuestionMarkCircleIcon,
  RectangleGroupIcon,
  RocketLaunchIcon,
  ShareIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

import {
  ArrowPathIcon,
  CursorArrowRaysIcon,
  EyeSlashIcon,
} from "@heroicons/react/16/solid";

import AdvancedMenuVideo from "../../../../assets/tutorial/advanced-menu.mp4";
import EdgeManagementGIF from "../../../../assets/tutorial/edge-management.gif";
import ExpandWithAIVideo from "../../../../assets/tutorial/expand-with-ai.mp4";
import ExplorationGIF from "../../../../assets/tutorial/exploration.gif";
import HotbarVideo from "../../../../assets/tutorial/hotbar.mp4";
import InspectionGIF from "../../../../assets/tutorial/inspection.gif";
import IntroductionGIF from "../../../../assets/tutorial/introduction.gif";
import RiskVisionVideo from "../../../../assets/tutorial/risk-vision.mp4";
import SearchAddressVideo from "../../../../assets/tutorial/search-address.mp4";
import ShareGraphVideo from "../../../../assets/tutorial/share-graph.mp4";
import TaggingAddressesVideo from "../../../../assets/tutorial/tagging-addresses.mp4";
import TransactionsMenuVideo from "../../../../assets/tutorial/transactions-menu.mp4";

/** The IntroductionCard component is a tutorial step that introduces the Ward Graph application.
 */
const IntroductionCard: FC = () => {
  return (
    <>
      <TutorialImage src={IntroductionGIF} alt="Ward Graph Demonstration" />
      <TutorialCardTitle
        title="Introducing: Ward Graph"
        Icon={RocketLaunchIcon}
      />
      <TutorialCardParagraph text="Ward Graph is a next-gen blockchain graph explorer with a focus on risk-scoring, user experience, and open-source." />
    </>
  );
};

/** The InspectionCard component is a tutorial step that explains how to inspect an address in the Ward Graph application.
 */
const InspectionCard: FC = () => {
  return (
    <>
      <TutorialImage src={InspectionGIF} alt="Ward Graph Demonstration" />
      <TutorialCardTitle title="Inspection" Icon={MagnifyingGlassIcon} />
      <TutorialCardParagraph text="To inspect an address, simply click the address node. You'll be able to see the relationship of the address with other entities." />
    </>
  );
};

/** The ExplorationCard component is a tutorial step that explains how to explore the blockchain in the Ward Graph application.
 */
const ExplorationCard: FC = () => {
  return (
    <>
      <TutorialImage src={ExplorationGIF} alt="Ward Graph Demonstration" />
      <TutorialCardTitle title="Exploration" Icon={PlusCircleIcon} />
      <TutorialCardParagraph text="To expand to other addresses, you can click the 'Expand' button." />
    </>
  );
};

/** The EdgeManagementCard component is a tutorial step that explains how to manage edges in the Ward Graph application.
 */
const EdgeManagementCard: FC = () => {
  const listItems = [
    {
      text: "Only the paths you expand through are shown by default.",
      Icon: ArrowPathIcon,
    },
    {
      text: "You can inspect an address to see its hidden 'grayed-out' edges.",
      Icon: EyeSlashIcon,
    },
    {
      text: "Click the edges to toggle them on or off.",
      Icon: CursorArrowRaysIcon,
    },
  ];

  return (
    <>
      <TutorialImage src={EdgeManagementGIF} alt="Ward Graph Demonstration" />
      <TutorialCardTitle title="Edge Management" Icon={ArrowTrendingUpIcon} />
      <div>
        <TutorialCardParagraph text="There are a lot of transactions on the blockchain!" />
        <TutorialCardList items={listItems} />
      </div>
    </>
  );
};

/** The HotbarCard component is a tutorial step that explains the functionality of the hotbar in the Ward Graph application.
 * The hotbar is a set of buttons that provide quick access to important features of the application.
 *
 * The hotbar contains the following buttons:
 * - Search Address
 * - Organize Layout
 * - Risk Vision
 * - Save Graph
 * - Share Graph
 * - Tutorial Button
 * - Report Bug
 *
 * Each button has an icon and a text label.
 */
const HotbarCard: FC = () => {
  // List of items to display in the tutorial card list
  const listItems = [
    {
      text: "Search Address",
      Icon: PlusCircleIcon,
    },
    {
      text: "Organize Layout",
      Icon: RectangleGroupIcon,
    },
    {
      text: "Risk Vision",
      Icon: EyeIcon,
    },
    {
      text: "Save Graph",
      Icon: BookmarkIcon,
    },
    {
      text: "Share Graph",
      Icon: ShareIcon,
    },
    {
      text: "Tutorial Button",
      Icon: QuestionMarkCircleIcon,
    },
    {
      text: "Report Bug",
      Icon: BugAntIcon,
    },
  ];

  return (
    <>
      <TutorialVideo src={HotbarVideo} alt="Hotbar Demonstration" />
      <TutorialCardTitle title="Hotbar" Icon={ArrowTrendingUpIcon} />
      <div>
        <TutorialCardParagraph text="The hotbar is located at the bottom right corner of the screen. Here you can find" />
        <TutorialCardList items={listItems} />
      </div>
    </>
  );
};

/** The RiskVisionCard component is a tutorial step that explains the functionality of the risk vision feature in the Ward Graph application.
 */
const RiskVisionCard: FC = () => {
  return (
    <>
      <TutorialVideo src={RiskVisionVideo} alt="Risk Vision Demonstration" />
      <TutorialCardTitle title="Risk Vision" Icon={EyeIcon} />
      <TutorialCardParagraph text="Ward Graph uses a proprietary risk-scoring algorithm to help you identify risky addresses, on a scale of 0 to 10." />
    </>
  );
};

/** The SearchAddressCard component is a tutorial step that explains how to search for an address in the Ward Graph application.
 */
const SearchAddressCard: FC = () => {
  return (
    <>
      <TutorialVideo
        src={SearchAddressVideo}
        alt="Search Address Demonstration"
      />
      <TutorialCardTitle title="Search Address" Icon={MagnifyingGlassIcon} />
      <TutorialCardParagraph text="To search for an address, you can open the searchbar by clicking the search icon on the hotbar at the bottom right corner of the screen." />
    </>
  );
};

/** The ShareGraphCard component is a tutorial step that explains how to share a graph in the Ward Graph application.
 */
const ShareGraphCard: FC = () => {
  return (
    <>
      <TutorialVideo src={ShareGraphVideo} alt="Share Graph Demonstration" />
      <TutorialCardTitle title="Share Graph" Icon={ShareIcon} />
      <TutorialCardParagraph text="To share a graph, you can click the share icon on the hotbar at the bottom right corner of the screen." />
    </>
  );
};

/** The TaggingAddressesCard component is a tutorial step that explains how to tag addresses in the Ward Graph application.
 */
const TaggingAddressesCard: FC = () => {
  return (
    <>
      <TutorialVideo
        src={TaggingAddressesVideo}
        alt="Tagging Addresses Demonstration"
      />
      <TutorialCardTitle title="Tagging Addresses" Icon={TagIcon} />
      <TutorialCardParagraph text="You can tag addresses by clicking on the input box and typing in a tag. You can also select from a list of your previously used tags." />
    </>
  );
};

/** The AdvancedMenuCard component is a tutorial step that explains how to access the advanced menu in the Ward Graph application.
 */
const AdvancedMenuCard: FC = () => {
  return (
    <>
      <TutorialVideo
        src={AdvancedMenuVideo}
        alt="Advanced Menu Demonstration"
      />
      <TutorialCardTitle
        title="Advanced Menu"
        Icon={PresentationChartLineIcon}
      />
      <TutorialCardParagraph
        text={
          'You can access the advanced menu by clicking on the "Advanced" button on the top right corner of the address analysis window.'
        }
      />
    </>
  );
};

/** The ExpandWithAICard component is a tutorial step that explains how to expand the graph with AI in the Ward Graph application.
 */
const ExpandWithAICard: FC = () => {
  return (
    <>
      <TutorialVideo
        src={ExpandWithAIVideo}
        alt="Expand With AI Demonstration"
      />
      <TutorialCardTitle title="Expand With AI" Icon={ArrowTrendingUpIcon} />
      <TutorialCardParagraph text="You can use the AI to expand the graph based on the risk score of the addresses. Click on the purple button on the top of the analysis window to expand the graph with AI." />
    </>
  );
};

/** The TransactionsMenuCard component is a tutorial step that explains how to access the transactions menu in the Ward Graph application.
 */
const TransactionsMenuCard: FC = () => {
  return (
    <>
      <TutorialVideo
        src={TransactionsMenuVideo}
        alt="Transactions Menu Demonstration"
      />
      <TutorialCardTitle title="Transactions Menu" Icon={ArrowsRightLeftIcon} />
      <TutorialCardParagraph
        text={
          'You can access the transactions menu by clicking on the "Transactions" button on the top right corner of the address analysis window.'
        }
      />
    </>
  );
};

/** The GoodLuckCard component is a tutorial step that wishes the user good luck as they explore the blockchain in the Ward Graph application.
 */
const GoodLuckCard: FC = () => {
  return (
    <>
      <TutorialImage src={IntroductionGIF} alt="Ward Graph Demonstration" />
      <TutorialCardTitle title="Good Luck!" Icon={FireIcon} />
      <h3 className="text-sm text-gray-600">
        You're ready to explore the blockchain. Good luck! You can view the
        advanced documentation in the{" "}
        <a
          className="font-semibold text-blue-500 hover:underline"
          href="https://wardanalytics.gitbook.io/ward-analytics-spellbook/"
          target="_blank"
          rel="noreferrer"
        >
          Ward Spellbook Documentation
        </a>
        .
      </h3>
    </>
  );
};

/** A list of tutorial steps for the Ward Graph tutorial. Each step is a React component that is displayed in the tutorial dialog.
 */
const tutorialSteps = [
  IntroductionCard,
  InspectionCard,
  ExplorationCard,
  GoodLuckCard,
];

export default tutorialSteps;
