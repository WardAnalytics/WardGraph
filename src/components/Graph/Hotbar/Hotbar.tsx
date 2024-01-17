import { RectangleGroupIcon, ShareIcon } from "@heroicons/react/24/solid";
import { FC, useContext, useState } from "react";

import { GraphContext } from "../Graph";
import ShareDialog from "../LandingPage/ShareDialog";

interface HotbarButton {
  onClick?: () => void;
  Icon: any;
  name: string;
}

const Hotbar: FC = () => {
  const { doLayout, copyLink, getSharingLink } = useContext(GraphContext);

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const shareUrl = getSharingLink();
  console.log(shareUrl)

  const onShareUrl = () => {
    copyLink(shareUrl);
  }

  const openShareDialog = () => {
    setIsShareDialogOpen(true);
  }

  const Buttons: HotbarButton[] = [
    {
      Icon: RectangleGroupIcon,
      name: "Organize Layout",
      onClick: doLayout,
    },
    {
      Icon: ShareIcon,
      name: "Share",
      onClick: openShareDialog
    }
  ]

  return (
    <>
      <div className="flex h-fit w-fit flex-col gap-y-1 rounded-lg bg-gray-800 p-2">
        {Buttons.map((button) => {
          return (
            <button
              className="group flex flex-row items-center"
              key={button.name}
              onClick={button.onClick}
            >
              <button.Icon className="h-10 w-10 rounded-lg p-1 text-blue-100 transition-all duration-200 hover:bg-gray-700 hover:text-blue-300" />
              <h1 className="absolute ml-[3.25rem] mt-0.5 w-max rounded-lg bg-gray-800 px-3 py-2 text-sm font-medium text-blue-300 opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100 dark:bg-gray-700">
                {button.name}
              </h1>
            </button>
          );
        })}
      </div>
      <ShareDialog shareUrl={shareUrl} isOpen={isShareDialogOpen} setIsOpen={setIsShareDialogOpen} onShareUrl={onShareUrl} />
    </>
  );
};

export default Hotbar;
