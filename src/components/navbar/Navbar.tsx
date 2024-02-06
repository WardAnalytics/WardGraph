import { FC, useState } from "react";
import authService from "../../services/auth/auth.services";
import logo from "../../assets/ward-logo-blue.svg";
import { useNavigate } from "react-router-dom";

import clsx from "clsx";

// Icons from Heroicons
import {
  ArrowUturnLeftIcon,
  ListBulletIcon,
  KeyIcon,
  BoltIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";

import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

// To add more tabs, simply add more objects to the navigation array. Href indicates the page to go to
const navigation = [
  { name: "Risk Feed", href: "risk-feed", icon: ListBulletIcon },
  { name: "Automations", href: "automations", icon: BoltIcon },
  { name: "API", href: "api", icon: KeyIcon },
  { name: "My Graphs", href: "graph", icon: ShareIcon },
];

interface SideNavBarButton {
  name: string;
  href: string;
  Icon: any;
  onClick?: () => void;
}

const NavbarButton: FC<SideNavBarButton> = ({ name, href, Icon, onClick }) => {
  const isCurrent: boolean = window.location.href.includes(href);

  return (
    <a
      key={name}
      onClick={onClick}
      className={clsx(
        isCurrent
          ? "bg-gray-50 text-blue-600"
          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600",
        "group flex cursor-pointer gap-x-3 rounded-md p-1.5 text-sm font-semibold leading-6",
      )}
    >
      <Icon
        className={clsx(
          isCurrent
            ? "text-blue-600"
            : "text-gray-400 group-hover:text-blue-600",
          "h-5 w-5 shrink-0",
        )}
        aria-hidden="true"
      />
      {name}
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
    console.log(error);
  };

  const [isHidden, setIsHidden] = useState(false);

  return (
    <>
      <div className="flex w-fit flex-row">
        <div
          className="relative h-full"
          style={{
            width: isHidden ? "0rem" : "11rem",
            transition: "width 0.3s ease-in-out",
          }}
        />
        <div
          className="absolute h-full w-44 overflow-hidden truncate border-r border-gray-200 bg-white"
          style={{
            width: isHidden ? "0rem" : "11rem",
            scale: isHidden ? "0.9" : "1",
            opacity: isHidden ? "0" : "1",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <div className="flex h-full grow flex-col gap-y-5 overflow-hidden  bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center justify-center ">
              <img className="h-8 w-auto " src={logo} alt="Ward Analytics" />
            </div>
            <nav className="flex h-full flex-1 flex-col">
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
                        />
                      </li>
                    ))}
                  </ul>
                </li>

                <li className="mt-auto">
                  <a
                    onClick={handleSignOut}
                    className="group -mx-2 flex cursor-pointer gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-red-600"
                  >
                    <ArrowUturnLeftIcon
                      className="h-5 w-5 shrink-0  text-gray-400 group-hover:text-red-600"
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
          className="pointer-events-none absolute z-50 flex h-full w-fit flex-row items-center justify-center align-middle"
          style={{
            marginLeft: isHidden ? "1rem" : "12rem",
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
