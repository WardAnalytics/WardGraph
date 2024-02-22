import {
  BookmarkIcon,
  BugAntIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusCircleIcon,
  QuestionMarkCircleIcon,
  RectangleGroupIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

import clsx from "clsx";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useKeyPress } from "reactflow";
import { GraphContext } from "../Graph";

import NewAddressModal from "./components/NewAddressModal";
import ShareDialog from "./components/ShareDialog";

import { useSearchParams } from "react-router-dom";
import WithAuth, { WithAuthProps } from "../../auth/WithAuth";
import { logAnalyticsEvent } from "../../../services/firestore/analytics/analytics";
import CreateGraphDialog from "./components/CreateGraphDialog";

interface HotbarButton {
  onClick?: () => void;
  Icon: any;
  name: string;
  className?: string;
  iconColor?: string;
  hotKey?: string;
}

const HotbarButton: FC<HotbarButton> = ({
  Icon,
  name,
  onClick,
  className,
  iconColor,
  hotKey,
}) => {
  const hotKeyClicked = hotKey ? useKeyPress(hotKey) : false;

  useEffect(() => {
    if (onClick && hotKeyClicked) {
      onClick();
    }
  }, [hotKeyClicked]);

  return (
    <button
      className={clsx("group flex flex-row items-center", className)}
      key={name}
      onClick={onClick}
    >
      <span className="pointer-events-none absolute mr-[100%] mt-0.5 flex w-max translate-x-[-100%] flex-row rounded-lg bg-gray-800 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100 dark:bg-gray-700">
        {hotKey && (
          <span
            className="mr-5 font-normal capitalize text-gray-400
            "
          >
            {hotKey}
          </span>
        )}
        {name}
      </span>
      <Icon
        className={clsx(
          "h-10 w-10 rounded-lg p-1 transition-all duration-200",
          iconColor
            ? iconColor
            : "text-gray-400 hover:bg-gray-700 hover:text-gray-200",
        )}
      />
    </button>
  );
};

interface HotbarButtonGroupProps {
  children: any;
  className?: string;
}

const HotbarButtonGroup: FC<HotbarButtonGroupProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-y-0.5",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface HotbarProps extends WithAuthProps {
  initialSearchbarValue: boolean;
}

const Hotbar: FC<HotbarProps> = ({
  initialSearchbarValue,
  handleActionRequiringAuth
}) => {
  const {
    doLayout,
    generateSharableLink,
    setShowTutorial,
    isRiskVision,
    setShowRiskVision,
    isSavedGraph,
    personalGraphInfo,
  } = useContext(GraphContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(initialSearchbarValue);
  const [isCreateGraphDialogOpen, setIsCreateGraphDialogOpen] = useState(false);

  const saveGraphParam = useMemo(() => {
    return searchParams.get("save_graph")
  }, [searchParams]);

  useEffect(() => {
    setSearchParams(new URLSearchParams(location.search));
  }, [location.search]);


  useEffect(() => {
    if (saveGraphParam) {
      setIsCreateGraphDialogOpen(true);
    }
  }, [saveGraphParam]);

  return (
    <>
      <div className="mb-3 flex h-fit w-fit flex-col gap-y-1 divide-y-2 divide-gray-600 rounded-lg bg-gray-800 p-2">
        <HotbarButtonGroup>
          <HotbarButton
            Icon={PlusCircleIcon}
            name="Search Address"
            onClick={() => {
              setIsAddAddressModalOpen(true);
            }}
            hotKey="a"
          />
          <HotbarButton
            Icon={RectangleGroupIcon}
            name="Organize Layout"
            onClick={() => {
              doLayout()
              logAnalyticsEvent("organize_layout_clicked");
            }}
            iconColor="text-indigo-400 hover:bg-indigo-700 hover:text-indigo-200"
            hotKey="l"
          />
          <HotbarButton
            Icon={isRiskVision ? EyeIcon : EyeSlashIcon}
            name="Risk Vision"
            onClick={() => {
              setShowRiskVision(!isRiskVision);
              logAnalyticsEvent("risk_vision_clicked", { active: !isRiskVision });
            }}
            hotKey="r"
          />
        </HotbarButtonGroup>
        <HotbarButtonGroup className="pt-1">
          {!isSavedGraph && (
            <HotbarButton
              Icon={BookmarkIcon}
              name="Save Graph"
              onClick={() => {
                // The handleActionRequiringAuth function throws an error if the user is not authenticated,
                // preventing the following actions from being executed
                handleActionRequiringAuth({
                  pathname: "graph",
                  queryParams: {
                    save_graph: "true"
                  }
                });

                // Are only executed if the user is authenticated
                setIsCreateGraphDialogOpen(true);
                logAnalyticsEvent("save_graph_modal_opened");
              }}
            />
          )}
          <HotbarButton
            Icon={ShareIcon}
            name="Share"
            onClick={() => {
              setIsShareDialogOpen(true);
              logAnalyticsEvent("share_graph_modal_opened");
            }}
            hotKey="s"
          />
          <HotbarButton
            Icon={QuestionMarkCircleIcon}
            name="Tutorial"
            onClick={() => {
              setShowTutorial(true);
              logAnalyticsEvent("tutorial_opened");
            }}
          />
        </HotbarButtonGroup>
        <HotbarButtonGroup className="pt-1">
          <HotbarButton
            Icon={BugAntIcon}
            name="Report Bug / Submit Feedback"
            onClick={() => {
              logAnalyticsEvent("report_bug_clicked")
              // Open in a new tab to avoid losing the current graph
              // To improve SEO, this action is onClick instead of a simple link because the other buttons don't use href
              window.open("https://forms.gle/yCFrDnKyUmPYPhfg8", "_blank")
            }}
          />
        </HotbarButtonGroup>
      </div>
      <ShareDialog
        isOpen={isShareDialogOpen}
        setIsOpen={setIsShareDialogOpen}
        generateSharableLink={generateSharableLink}
      />
      <NewAddressModal
        isOpen={isAddAddressModalOpen}
        setOpen={setIsAddAddressModalOpen}
      />
      <CreateGraphDialog
        isOpen={isCreateGraphDialogOpen}
        setOpen={setIsCreateGraphDialogOpen}
        graphInfo={personalGraphInfo}
      />
    </>
  );
};

// The Hotbar component has the following features that require authentication:
//  * Saving a graph

export default WithAuth(Hotbar);
