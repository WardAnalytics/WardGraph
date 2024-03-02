import { FC, useMemo, useState } from "react";
import logo from "../../assets/ward-logo-blue.svg";
import authService from "../../services/auth/auth.services";

import { useNavigate } from "react-router-dom";
import { Colors } from "../../utils/colors";
import Badge from "../common/Badge";

import clsx from "clsx";

import {
  ArrowUturnLeftIcon,
  BoltIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  CreditCardIcon,
  KeyIcon,
  ListBulletIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

import { Transition } from "@headlessui/react";
import {
  PlusCircleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/16/solid";
import { logAnalyticsEvent } from "../../services/firestore/analytics/analytics";
import {
  PersonalGraphInfo,
  getGraphHref,
  usePersonalGraphs,
} from "../../services/firestore/user/graph_saving";
import CreateGraphDialog from "../common/CreateGraphDialog";

// To add more tabs, simply add more objects to the navigation array. Href indicates the page to go to
const navigation = [
  { name: "Risk Feed", href: "risk-feed", icon: ListBulletIcon, isBeta: true },
  { name: "Automations", href: "automations", icon: BoltIcon, isBeta: true },
  { name: "API", href: "api", icon: KeyIcon, isBeta: true },
  { name: "My Graphs", href: "graphs", icon: ShareIcon, isBeta: false },
];

interface SideNavBarButton {
  name: string;
  href: string;
  Icon: any;
  isBeta: boolean;
  onClick?: () => void;
}

const NavbarButton: FC<SideNavBarButton> = ({
  name,
  href,
  Icon,
  onClick,
  isBeta,
}) => {
  const isCurrent: boolean = window.location.href.includes(href);

  return (
    <a
      key={name}
      onClick={isBeta ? undefined : onClick}
      className={clsx(
        isBeta
          ? "gap-x-2 rounded-md text-gray-400 "
          : isCurrent
            ? "gap-x-2.5 rounded-lg bg-blue-50 text-blue-600 shadow-lg shadow-blue-200/25 ring-1 ring-blue-200"
            : "cursor-pointer gap-x-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600",
        "group flex p-1.5 text-sm font-semibold leading-6 transition-all duration-200 ease-in-out",
      )}
    >
      <Icon
        className={clsx(
          isBeta
            ? "text-gray-400"
            : isCurrent
              ? "text-blue-600"
              : "text-gray-400 group-hover:text-blue-600",
          "mt-0.5 h-5 w-5 shrink-0 transition-all duration-200 ease-in-out",
        )}
        aria-hidden="true"
      />
      {name}
      {isBeta && (
        <Badge
          text="Soon"
          color={Colors.PURPLE}
          className="px-1 py-0 text-xs"
          Icon={WrenchScrewdriverIcon}
        />
      )}
    </a>
  );
};

interface SavedGraphRowProps {
  name: string;
  href: string;
  isLast: boolean;
}

const SAVED_GRAPHS_LIMIT = 3;

const NEW_GRAPH_INFO: PersonalGraphInfo = {
  addresses: [],
  edges: [],
  tags: [],
  averageRisk: 0,
  totalVolume: 0,
};

interface SavedGraphsProps {
  userID: string;
}

const SavedGraphs: FC<SavedGraphsProps> = ({ userID }) => {
  const [isCreateGraphDialogOpen, setIsCreateGraphDialogOpen] = useState(false);

  const { graphs } = usePersonalGraphs(userID ? userID : "");
  const { displayedGraphs } = useMemo(() => {
    return {
      displayedGraphs: graphs.slice(0, SAVED_GRAPHS_LIMIT),
    };
  }, [graphs]);

  return (
    <>
      <div className="flex flex-col gap-x-2.5 pl-[0.8rem]">
        {displayedGraphs.map((graph, index) => (
          <Transition
            key={graph.uid}
            show={true}
            appear={true}
            enter="transition-all duration-300"
            enterFrom="opacity-0 -translate-y-5"
            enterTo="opacity-100 translate-y-0"
            style={{
              transitionDelay: `${index * 50}ms`,
            }}
          >
            <SavedGraphRow
              name={graph.name}
              href={getGraphHref(userID, graph)}
              isLast={index === displayedGraphs.length - 1}
            />
          </Transition>
        ))}
        <button
          key="New Graph"
          onClick={() => setIsCreateGraphDialogOpen(true)}
          className="group -mb-10 flex h-10 cursor-pointer flex-row items-center gap-x-4 text-xs font-semibold text-gray-500 transition-all  duration-150 hover:gap-x-[1.1rem] hover:text-gray-700"
        >
          <div className="mb-1 h-1/2 w-[1.5px] -translate-y-1/2 bg-gray-300" />
          <PlusCircleIcon
            className="absolute h-5 w-5 -translate-x-[0.6rem] rounded-full bg-white p-[0.06rem] text-gray-400 ring-[1.5px] ring-gray-300 transition-all duration-150 group-hover:text-gray-500"
            aria-hidden="true"
          />
          New Graph
        </button>
      </div>
      <CreateGraphDialog
        isOpen={isCreateGraphDialogOpen}
        setOpen={setIsCreateGraphDialogOpen}
        graphInfo={NEW_GRAPH_INFO}
      />
    </>
  );
};

const SavedGraphRow: FC<SavedGraphRowProps> = ({ name, href }) => {
  const navigate = useNavigate();
  const isCurrent = window.location.href.includes(href);

  return (
    <a
      key={name}
      onClick={() => navigate(href)}
      className={clsx(
        isCurrent ? "text-blue-500" : "text-gray-500 hover:text-gray-700",
        "group flex h-10 cursor-pointer flex-row items-center gap-x-3 text-xs font-semibold transition-all duration-150 hover:gap-x-3.5",
      )}
    >
      <div className="relative flex h-full flex-row items-center">
        {/* If it's the last, only display half a bar connecting upwards instead of a full bar. */}
        <div
          className={clsx(
            "h-full w-[1.5px] transition-all duration-150",
            isCurrent
              ? "bg-gradient-to-t from-gray-300 via-blue-400 to-gray-300 "
              : "bg-gradient-to-t from-gray-300 to-gray-300",
          )}
        />
        <div
          className={clsx(
            "transtion-all absolute -left-[0.2rem] h-2 w-2 rounded-full bg-white ring-[1.5px] duration-150",
            isCurrent ? "ring-blue-500" : "ring-gray-300",
          )}
        />
        <div
          className={clsx(
            "absolute -left-[0.2rem] h-2 w-2 rounded-full  ring-inset ring-white transition-all duration-150",
            isCurrent
              ? "bg-blue-400 opacity-100 ring-1"
              : "bg-gray-300 opacity-0 ring-0 group-hover:opacity-100",
          )}
        />
      </div>
      {name}
    </a>
  );
};

interface NavbarProps {
  userID: string;
  open?: boolean;
}

const Navbar: FC<NavbarProps> = ({ userID, open = false }) => {
  // Sign out functionality
  const navigate = useNavigate();

  const onLogoutSuccess = () => {
    localStorage.clear();
    sessionStorage.clear();
    console.log("Logged out");
    navigate("/");
  };
  const onLogoutError = (error: any) => {
    console.error(error);
  };

  const [isHidden, setIsHidden] = useState(!open);

  // If the current page is

  return (
    <>
      <div className="flex w-fit flex-row">
        <div
          className="relative h-full"
          style={{
            width: isHidden ? "0rem" : "15rem",
            transition: "width 0.3s ease-in-out",
          }}
        />
        <div
          className="absolute h-full overflow-hidden truncate border-r border-gray-200 bg-white"
          style={{
            width: isHidden ? "0rem" : "15rem",
            scale: isHidden ? "0.9" : "1",
            opacity: isHidden ? "0" : "1",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <div className="flex h-full grow flex-col gap-y-5 divide-y divide-gray-200 overflow-hidden bg-white px-6 pb-4">
            <div className="mt-6 flex h-10 shrink-0 items-center justify-center ">
              <img className="h-8 w-auto" src={logo} alt="Ward Analytics" />
            </div>
            <nav className="flex h-full flex-1 flex-col pt-4">
              <ul role="list" className="flex h-full flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-0.5">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <NavbarButton
                          name={item.name}
                          href={item.href}
                          Icon={item.icon}
                          onClick={() => {
                            logAnalyticsEvent("navbar_option_clicked", {
                              name: item.name,
                            });
                            navigate(`/${userID}/${item.href}`);
                          }}
                          isBeta={item.isBeta}
                        />
                      </li>
                    ))}
                    <li>
                      <SavedGraphs userID={userID} />
                    </li>
                  </ul>
                </li>

                <li className="mt-auto flex flex-col gap-y-2.5">
                  <NavbarButton
                    name="Plan & Billing"
                    href="billing"
                    Icon={CreditCardIcon}
                    isBeta={false}
                    onClick={() => {
                      logAnalyticsEvent("navbar_option_clicked", {
                        name: "Plan & Billing",
                      });
                      navigate(`/${userID}/billing`);
                    }}
                  />
                  <a
                    onClick={() =>
                      authService.logout(onLogoutSuccess, onLogoutError)
                    }
                    className="group flex cursor-pointer gap-x-2 rounded-md p-1.5 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-100 hover:text-red-600"
                  >
                    <ArrowUturnLeftIcon
                      className="mt-0.5 h-5 w-5 text-gray-400 group-hover:text-red-600"
                      aria-hidden="true"
                    />
                    Log Out
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div
          className="pointer-events-none absolute z-10 flex h-full w-fit flex-row items-center justify-center align-middle"
          style={{
            marginLeft: isHidden ? "1rem" : "16rem",
            transition: "margin-left 0.3s ease-in-out",
          }}
        >
          {isHidden ? (
            <ChevronDoubleRightIcon
              className="pointer-events-auto h-6 w-6 shrink-0 cursor-pointer text-gray-400 hover:text-gray-700"
              aria-hidden="true"
              onClick={() => setIsHidden(!isHidden)}
            />
          ) : (
            <ChevronDoubleLeftIcon
              className="pointer-events-auto h-6 w-6 shrink-0 cursor-pointer text-gray-400 hover:text-gray-700"
              aria-hidden="true"
              onClick={() => setIsHidden(!isHidden)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
