import { FC } from "react";
import clsx from "clsx";

import logo from "../assets/ward-logo-blue-full.svg";
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";

interface MobileWarningTemplateProps {
  className?: string;
}

const MobileWarningTemplate: FC<MobileWarningTemplateProps> = ({
  className,
}) => {
  return (
    <>
      <div
        className={clsx(
          "flex max-w-screen-sm flex-col items-center justify-center gap-y-10 p-10",
          className,
        )}
      >
        <img src={logo} alt="Ward Logo" className="w-full" />
        <div className="justify-left flex flex-row items-center gap-x-3 rounded-lg bg-yellow-50 p-4">
          <ComputerDesktopIcon className="h-12 w-12 text-yellow-500" />
          <p className="text-sm text-yellow-800">
            The Ward graph explorer is only available on desktop. Please use a
            larger screen to access the explorer.
          </p>
        </div>
      </div>
    </>
  );
};

export default MobileWarningTemplate;
