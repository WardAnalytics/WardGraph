import { RectangleGroupIcon, ShareIcon } from "@heroicons/react/24/solid";
import { FC, useContext, useEffect, useMemo, useState } from "react";

import {
  QuestionMarkCircleIcon
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useKeyPress } from "reactflow";
import ShareDialog from "../../LandingPage/ShareDialog";
import { GraphContext } from "../Graph";

interface HotKeyButtonProps {
  hotKey: string
}

const HotKeyButton: FC<HotKeyButtonProps> = ({
  hotKey
}) => {
  return (
    <div className="flex justify-center w-5 rounded-sm h-full bg-blue-300 text-gray-900">
      {hotKey.toLocaleUpperCase()}
    </div>
  )
}

interface HotbarButtonProps {
  onClick: () => void;
  Icon: any;
  name: string;
  hotKey?: string
}

const HotbarButton: FC<HotbarButtonProps> = ({
  Icon,
  name,
  onClick,
  hotKey
}) => {

  const hotKeyClicked = hotKey ? useKeyPress(hotKey) : false

  useEffect(() => {
    if (hotKeyClicked) {
      onClick()
    }
  }, [hotKeyClicked])

  return (
    <button
      className="group flex flex-row items-center"
      key={name}
      onClick={onClick}
    >
      <Icon className="h-10 w-10 rounded-lg p-1 text-blue-100 transition-all duration-200 hover:bg-gray-700 hover:text-blue-300" />
      <div className="absolute flex gap-x-2 ml-[3.25rem] mt-0.5 w-max rounded-lg bg-gray-800 px-3 py-2 text-sm font-medium text-blue-300 opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100 dark:bg-gray-700">
        <h1 className="whitespace-nowrap">
          <span>{name}</span>
        </h1>
        {
          hotKey &&
          <HotKeyButton hotKey={hotKey} />
        }
      </div >
    </button >
  )
}

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
  }

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
            hotKey="e"
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
