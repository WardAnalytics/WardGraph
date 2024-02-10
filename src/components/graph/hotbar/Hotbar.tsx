import {
  BugAntIcon,
  PlusCircleIcon,
  QuestionMarkCircleIcon,
  RectangleGroupIcon,
  ShareIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

import clsx from "clsx";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useKeyPress } from "reactflow";
import { GraphContext } from "../Graph";

import ShareDialog from "./components/ShareDialog";
import NewAddressModal from "./components/NewAddressModal";

interface HotbarButton {
  onClick?: () => void;
  href?: string;
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
  href,
}) => {
  const hotKeyClicked = hotKey ? useKeyPress(hotKey) : false;

  useEffect(() => {
    if (onClick && hotKeyClicked) {
      onClick();
    }
  }, [hotKeyClicked]);

  return (
    <a href={href} target="_blank" className="h-full w-full">
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
    </a>
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

const Hotbar: FC = () => {
  const {
    doLayout,
    copyLink,
    getSharingLink,
    setShowTutorial,
    isRiskVision,
    setShowRiskVision,
  } = useContext(GraphContext);

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

  const shareUrl = useMemo(() => getSharingLink(), []);

  const onShareUrl = () => {
    copyLink(shareUrl);
  };

  const openShareDialog = () => {
    setIsShareDialogOpen(true);
  };

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
            onClick={doLayout}
            iconColor="text-indigo-400 hover:bg-indigo-700 hover:text-indigo-200"
            hotKey="l"
          />
          <HotbarButton
            Icon={isRiskVision ? EyeIcon : EyeSlashIcon}
            name="Risk Vision"
            onClick={() => {
              setShowRiskVision(!isRiskVision);
            }}
            hotKey="r"
          />
        </HotbarButtonGroup>
        <HotbarButtonGroup className="pt-1">
          <HotbarButton
            Icon={ShareIcon}
            name="Share"
            onClick={openShareDialog}
            hotKey="s"
          />
          <HotbarButton
            Icon={QuestionMarkCircleIcon}
            name="Tutorial"
            onClick={() => {
              setShowTutorial(true);
            }}
          />
        </HotbarButtonGroup>
        <HotbarButtonGroup className="pt-1">
          <HotbarButton
            Icon={BugAntIcon}
            name="Report Bug / Give Feedback"
            onClick={() => {}}
            href="https://forms.gle/yCFrDnKyUmPYPhfg8"
          />
        </HotbarButtonGroup>
      </div>
      <ShareDialog
        shareUrl={shareUrl}
        isOpen={isShareDialogOpen}
        setIsOpen={setIsShareDialogOpen}
        onShareUrl={onShareUrl}
      />
      <NewAddressModal
        isOpen={isAddAddressModalOpen}
        setOpen={setIsAddAddressModalOpen}
      />
    </>
  );
};

export default Hotbar;
