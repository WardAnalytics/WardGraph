import { FC, useContext, useState } from "react";
import { RectangleGroupIcon, ShareIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

import { GraphContext } from "../Graph";
import { Transition } from "@headlessui/react";

interface HotbarButton {
  onClick?: () => void;
  Icon: any;
  name: string;
}

interface ShareLinkButtonProps {
  name: string
  onClick: () => void
}

const ShareLinkButton: FC<ShareLinkButtonProps> = ({
  name,
  onClick: copyLink,
}) => {
  const [clicked, setClicked] = useState(false);

  const onClick = async () => {
    copyLink()

    // Set timeout the clicked state to false after 1 second
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 2000);
  }

  return (
    <button
      key={name}
      onClick={onClick}
      className="flex flex-row items-center"
    >
      <div className="h10 w-10 group flex flex-row items-center">
        <ShareIcon className="h-full w-full rounded-lg p-1 text-blue-100 transition-all duration-200 hover:bg-gray-700 hover:text-blue-300" />
        <Transition
          show={!clicked}
          appear={false}
          enter="transition-all duration-300 delay-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-all duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className={"absolute"}
        >
          <h1 className="ml-[3.25rem] mt-0.5 w-max rounded-lg bg-gray-800 px-3 py-2 text-sm font-medium text-blue-300 opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100 dark:bg-gray-700">
            {name}
          </h1>
        </Transition>
        <Transition
          show={clicked}
          appear={true}
          enter="transition-all duration-300 delay-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-all duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="absolute"
        >
          <h1 className="ml-[3.25rem] mt-0.5 w-max rounded-lg bg-gray-800 px-3 py-2 text-sm font-medium text-blue-300 opacity-0 shadow-sm transition-opacity duration-300 opacity-100 dark:bg-gray-700">
            Copied to clipboard!
          </h1>
        </Transition>
      </div>
    </button >
  );
}

const Hotbar: FC = () => {
  const { doLayout, copyLink } = useContext(GraphContext);

  const Buttons: HotbarButton[] = [
    {
      Icon: RectangleGroupIcon,
      name: "Organize Layout",
      onClick: doLayout,
    },
  ]

  return (
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
      <ShareLinkButton name="Copy Link" onClick={copyLink} />
    </div >
  );
};

export default Hotbar;
