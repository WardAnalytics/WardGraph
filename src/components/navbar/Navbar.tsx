import { FC, useState } from "react";
import authService from "../../services/auth/auth.services";
import logo from "../../assets/ward-logo-blue.svg";
import { useNavigate } from "react-router-dom";

import Badge from "../common/Badge";
import { Colors } from "../../utils/colors";

import clsx from "clsx";

// Icons from Heroicons
import {
  ArrowUturnLeftIcon,
  ListBulletIcon,
  KeyIcon,
  BoltIcon,
  ShareIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

import { CubeTransparentIcon } from "@heroicons/react/16/solid";

// To add more tabs, simply add more objects to the navigation array. Href indicates the page to go to
const navigation = [
  { name: "Risk Feed", href: "risk-feed", icon: ListBulletIcon, isBeta: false },
  { name: "Automations", href: "automations", icon: BoltIcon, isBeta: true },
  { name: "API", href: "api", icon: KeyIcon, isBeta: true },
  { name: "My Graphs", href: "graph", icon: ShareIcon, isBeta: false },
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
      onClick={onClick}
      className={clsx(
        isCurrent
          ? "gap-x-2.5 rounded-lg bg-blue-50 text-blue-600 shadow-lg shadow-blue-200/25 ring-1 ring-blue-200"
          : "gap-x-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600",
        "group flex cursor-pointer p-1.5 text-sm font-semibold leading-6 transition-all duration-200 ease-in-out",
      )}
    >
      <Icon
        className={clsx(
          isCurrent
            ? "text-blue-600"
            : "text-gray-400 group-hover:text-blue-600",
          "mt-0.5 h-5 w-5 shrink-0 transition-all duration-200 ease-in-out",
        )}
        aria-hidden="true"
      />
      {name}
      {isBeta && (
        <Badge
          text="BETA"
          color={Colors.PURPLE}
          className="px-1 py-0 text-xs"
          Icon={CubeTransparentIcon}
        />
      )}
    </a>
  );
};

const Navbar: FC = () => {
  // Sign out functionality
  const navigate = useNavigate();
  const handleSignOut = () => {
    authService.logout(onLogoutSuccess, onLogoutError);
  };
  const onLogoutSuccess = () => {
    console.log("Logged out");
  };
  const onLogoutError = (error: any) => {
    console.error(error);
  };

  const [isHidden, setIsHidden] = useState(false);

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
              <img className="h-8 w-auto " src={logo} alt="Ward Analytics" />
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
                          onClick={() => navigate(item.href)}
                          isBeta={item.isBeta}
                        />
                      </li>
                    ))}
                    <li>
                      <div className="flex flex-col gap-x-2.5 pl-[0.8rem]">
                        <span className="flex h-10 flex-row items-center gap-x-3 text-xs font-semibold text-gray-500">
                          <div className="relative flex h-full flex-row items-center">
                            <div className="h-full w-[1.5px] bg-gray-300" />
                            <div className="absolute -left-[0.2rem] h-2 w-2 rounded-full bg-white ring-[1.5px] ring-gray-300" />
                          </div>
                          SushiSwap Scam
                        </span>
                        <span className="flex h-10 flex-row items-center gap-x-3 text-xs font-semibold text-gray-500">
                          <div className="relative flex h-full flex-row items-center">
                            <div className="h-full w-[1.5px] bg-gray-300" />
                            <div className="absolute -left-[0.2rem] h-2 w-2 rounded-full bg-white ring-[1.5px] ring-gray-300" />
                          </div>
                          Kyberswap Exploit
                        </span>
                        <span className="flex h-10 flex-row items-center gap-x-3 text-xs font-semibold text-gray-500">
                          <div className="relative flex h-full flex-row items-center">
                            <div className="mb-1 h-1/2 w-[1.5px] -translate-y-1/2 bg-gray-300" />
                            <div className="absolute -left-[0.2rem] h-2 w-2 rounded-full bg-white ring-[1.5px] ring-gray-300" />
                          </div>
                          Ronin Hack
                        </span>
                      </div>
                    </li>
                  </ul>
                </li>

                <li className="mt-auto flex flex-col gap-y-2.5">
                  <NavbarButton
                    name="Plan & Billing"
                    href="billing"
                    Icon={CreditCardIcon}
                    isBeta={false}
                    onClick={() => navigate("billing")}
                  />
                  <a
                    onClick={handleSignOut}
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
