import { UserCircleIcon } from "@heroicons/react/20/solid";
import {
  BugAntIcon,
  PlusCircleIcon,
  QuestionMarkCircleIcon,
  RectangleGroupIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useKeyPress } from "reactflow";
import useAuthState from "../../../hooks/useAuthState";
import authService from "../../../services/auth/auth.services";
import { GraphContext } from "../Graph";
<<<<<<< HEAD:src/components/Graph/Hotbar/Hotbar.tsx
import { BookmarkIcon } from "@heroicons/react/24/solid";
import searchHistoryService from "../../../services/firebase/user/search-history";
import LoginDialog from "../LandingPage/AuthDialog";
import ShareDialog from "../LandingPage/ShareDialog";
import NewAddressModal from "../NewAddressModal";
=======

import ShareDialog from "./components/ShareDialog";
import NewAddressModal from "./components/NewAddressModal";
>>>>>>> pro:src/components/graph/hotbar/Hotbar.tsx

interface HotbarButton {
  onClick?: () => void;
  href?: string;
  Icon: any;
  name: string;
  className?: string;
  hotKey?: string;
}

const HotbarButton: FC<HotbarButton> = ({
  Icon,
  name,
  onClick,
  className,
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
        <Icon className="h-10 w-10 rounded-lg p-1 text-gray-400 transition-all duration-200 hover:bg-gray-700 hover:text-white" />
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
  const { doLayout, copyLink, getSharingLink, setShowTutorial } =
    useContext(GraphContext);

  const {isAthenticated} = useAuthState();

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

  const shareUrl = useMemo(() => getSharingLink(), []);

  const onShareUrl = () => {
    copyLink(shareUrl);
  };

  const openShareDialog = () => {
    setIsShareDialogOpen(true);
  };

  // TODO: Move this to sidebar
  const getSearchHistory = async () => {
    const userSearchHistory = await searchHistoryService.GetUserHistory();

    console.log(userSearchHistory);
  }

  const openLoginDialog = () => {
    setIsLoginDialogOpen(true);
  }

  const onLogoutSuccess = () => {
    console.log("Logout success");
    window.location.reload();
  }

  const onLogoutError = () => {
    console.log("Logout error");
  }

  const onLogout = () => {
    authService.logout(onLogoutSuccess, onLogoutError);
  }

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
          />
        </HotbarButtonGroup>
        <HotbarButtonGroup className="pt-1">
          {
            isAutenticated ? (
              <>
                <HotbarButton
                  Icon={BookmarkIcon}
                  name="Search History"
                  onClick={getSearchHistory}
                />
                <HotbarButton
                  Icon={UserCircleIcon}
                  name={"Logout"}
                  onClick={onLogout}
                />
              </>
            ) : (
              <HotbarButton
                Icon={UserCircleIcon}
                name="Login"
                onClick={openLoginDialog}
              />
            )
          }
          <HotbarButton
            Icon={BugAntIcon}
            name="Report Bug / Give Feedback"
            onClick={() => { }}
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
      <LoginDialog
        isOpen={isLoginDialogOpen}
        setIsOpen={setIsLoginDialogOpen} />
      <NewAddressModal
        isOpen={isAddAddressModalOpen}
        setOpen={setIsAddAddressModalOpen}
      />
    </>
  );
};

export default Hotbar;
