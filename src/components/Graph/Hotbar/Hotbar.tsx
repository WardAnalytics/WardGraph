import {
  RectangleGroupIcon,
  ShareIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { FC, useContext, useMemo, useState, useEffect } from "react";
import { useKeyPress } from "reactflow";
import clsx from "clsx";
import { GraphContext } from "../Graph";
import ShareDialog from "../LandingPage/ShareDialog";

interface HotbarButton {
  onClick?: () => void;
  Icon: any;
  name: string;
  className?: string;
  hotKey: string;
}

const HotbarButton: FC<HotbarButton> = ({
  Icon,
  name,
  onClick,
  className,
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
      <Icon className="h-8 w-8 rounded-lg p-1 text-gray-400 transition-all duration-200 hover:bg-gray-700 hover:text-white" />
      <span className="pointer-events-none absolute ml-8 mt-0.5 flex w-max flex-row rounded-lg bg-gray-800 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100 dark:bg-gray-700">
        {name}
        {hotKey && (
          <span
            className="ml-5 font-normal capitalize text-gray-400
          "
          >
            {hotKey}
          </span>
        )}
      </span>
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

const Hotbar: FC = () => {
  const { doLayout, copyLink, getSharingLink, setShowTutorial } =
    useContext(GraphContext);

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const shareUrl = useMemo(() => getSharingLink(), []);

  const onShareUrl = () => {
    copyLink(shareUrl);
  };

  const openShareDialog = () => {
    setIsShareDialogOpen(true);
  };

  return (
    <>
      <div className="flex h-fit w-fit flex-col gap-y-1 divide-y-2 divide-gray-600 rounded-lg bg-gray-800  p-2">
        <HotbarButtonGroup>
          {/* <HotbarButton
            Icon={MagnifyingGlassPlusIcon}
            name="Search Address"
            onClick={() => {}}
          /> */}
          <HotbarButton
            Icon={RectangleGroupIcon}
            name="Organize Layout"
            onClick={doLayout}
            hotKey="l"
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
            hotKey="t"
          />
        </HotbarButtonGroup>
      </div>
      <ShareDialog
        shareUrl={shareUrl}
        isOpen={isShareDialogOpen}
        setIsOpen={setIsShareDialogOpen}
        onShareUrl={onShareUrl}
      />
    </>
  );
};

export default Hotbar;
