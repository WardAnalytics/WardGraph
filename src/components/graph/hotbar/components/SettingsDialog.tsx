import { FC, useContext } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  FingerPrintIcon,
  CursorArrowRippleIcon,
} from "@heroicons/react/16/solid";
import clsx from "clsx";
import Modal from "../../../common/Modal";
import { GraphContext } from "../../Graph";

interface ModeButtonProps {
  isActive: boolean;
  setToggleMode: () => void;
  Icon: any;
  name: string;
}

const ModeButton: FC<ModeButtonProps> = ({
  isActive,
  setToggleMode,
  Icon,
  name,
}) => {
  return (
    <button
      type="button"
      className={clsx(
        "flex flex-row items-center gap-x-1 rounded-md px-3 py-2 text-sm font-semibold transition-all duration-300",
        {
          "bg-white text-gray-900 shadow-md": isActive,
          "text-gray-700 hover:bg-gray-200": !isActive,
        },
      )}
      onClick={setToggleMode}
    >
      <Icon
        className={clsx("h-5 w-5 rounded-full", {
          "text-blue-500": isActive,
          "text-gray-700": !isActive,
        })}
        aria-hidden="true"
      />
      <p
        className="w-fit overflow-hidden"
        style={{
          maxWidth: isActive ? "5rem" : "0px",
          opacity: isActive ? 1 : 0,
          transition: "all 0.3s ease-in-out",
        }}
      >
        {name}
      </p>
    </button>
  );
};

interface ModeToggleProps {
  isTrackPad: boolean;
  setIsTrackPad: (isTrackPad: boolean) => void;
}

const ModeToggle: FC<ModeToggleProps> = ({ isTrackPad, setIsTrackPad }) => {
  return (
    <span className="flex h-fit w-fit flex-row gap-x-0.5 rounded-lg border border-gray-300 bg-gray-100 p-1 shadow-inner ring-1 ring-inset ring-white">
      <ModeButton
        isActive={isTrackPad}
        setToggleMode={() => setIsTrackPad(true)}
        Icon={FingerPrintIcon}
        name="Trackpad"
      />
      <ModeButton
        isActive={!isTrackPad}
        setToggleMode={() => setIsTrackPad(false)}
        Icon={CursorArrowRippleIcon}
        name="Mouse"
      />
    </span>
  );
};

interface SettingsDialogProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const SettingsDialog: FC<SettingsDialogProps> = ({ isOpen, setOpen }) => {
  const { isTrackPad, setIsTrackPad } = useContext(GraphContext);
  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Modal isOpen={isOpen} closeModal={closeDialog} size="xl">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h3 className="flex flex-col gap-1.5 text-lg font-semibold leading-6 text-gray-900">
          Choose mouse or trackpad
          <p className="text-sm font-normal text-gray-500">
            Select the input device you are using
          </p>
        </h3>

        <XMarkIcon
          className="h-11 w-11 cursor-pointer rounded-full p-1.5 text-gray-400 transition-all duration-300 hover:bg-gray-100"
          aria-hidden="true"
          onClick={closeDialog}
        />
      </div>
      <div className="mt-5 flex flex-row items-center justify-center gap-5 ">
        <ModeToggle isTrackPad={isTrackPad} setIsTrackPad={setIsTrackPad} />
        {isTrackPad ? null : null}

        <p className="flex w-[1/2] flex-col gap-3 text-sm font-normal text-gray-500">
          <p className="flex flex-row items-center gap-1">
            <p className="font-bold">Pan:</p>
            {isTrackPad
              ? "Drag with two fingers"
              : "Scroll / Middle Mouse Drag"}
          </p>
          <p className="flex flex-row items-center gap-1">
            <p className="font-bold">Zoom:</p>

            {isTrackPad ? " Scroll with two fingers" : "Ctrl + Scroll"}
          </p>
          <p className="flex flex-row items-center gap-1">
            <p className="font-bold">Select:</p>

            {isTrackPad ? "Shift + Drag" : "Drag"}
          </p>
        </p>
      </div>
    </Modal>
  );
};

export default SettingsDialog;
