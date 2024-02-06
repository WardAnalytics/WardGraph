import { Transition } from "@headlessui/react";
import {
  ArrowUpRightIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { FC, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

import authService from "../../../services/auth/auth.services";
import { getUserHistory } from "../../../services/firebase/search-history/search-history";

import { HotKeysType } from "../../../types/hotKeys";

import isValidAddress from "../../../utils/isValidAddress";
import SearchHistoryPopover from "./SearchHistoryPopover";

const InvalidAddressPopover: FC = () => {
  return (
    <div className="ring-300 absolute top-full mt-2 w-72 -translate-x-56 transform rounded-md bg-red-100 p-3 shadow-lg ring-1 ring-red-300 transition-opacity duration-300">
      <span className="flex items-center space-x-2">
        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        <h3 className="text-sm font-medium text-red-800">Invalid Address</h3>
      </span>
      <div className="mt-2 space-y-2 text-sm text-red-700">
        <p>
          {" "}
          Your address is invalid. Please check if it is valid for the
          compatible blockchains:
        </p>
        <ul role="list" className="list-disc space-y-1 pl-5">
          <li>Ethereum</li>
        </ul>
      </div>
    </div>
  );
};

interface SearchBarProps {
  className?: string;
  onSearchAddress: (address: string) => void;
}

const Searchbar: FC<SearchBarProps> = ({ className, onSearchAddress }) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState<string>("");
  const [isUserHistoryPopoverOpen, setIsUserHistoryPopoverOpen] =
    useState(false);
  const [showInvalidAddressPopover, setShowInvalidAddressPopover] =
    useState(false);
  const [userHistory, setUserHistory] = useState<string[]>([]);
  const [selectedUserHistoyIndex, setSelectedUserHistoyIndex] = useState<
    number | null
  >(null);

  const isAddressValid = useMemo(() => isValidAddress(query), [query]);

  const { user } = authService.useAuthState();

  const uniqueSearchHistory = useMemo(() => {
    // Remove duplicates
    const uniqueHistory = userHistory.filter(
      (address, index, self) =>
        index ===
        self.findIndex((t) => t.toLowerCase() === address.toLowerCase()),
    );

    return uniqueHistory;
  }, [userHistory]);

  const onSearchAddressHandler = (input: string) => {
    if (isValidAddress(input)) {
      onSearchAddress(input);
    }
  };

  const moveSelectedIndexUp = () => {
    if (selectedUserHistoyIndex === null) {
      setSelectedUserHistoyIndex(0);
    } else {
      const newIndex =
        (selectedUserHistoyIndex - 1 + uniqueSearchHistory.length) %
        uniqueSearchHistory.length;
      setSelectedUserHistoyIndex(newIndex);
    }
  };

  const moveSelectedIndexDown = () => {
    if (selectedUserHistoyIndex === null) {
      setSelectedUserHistoyIndex(0);
    } else {
      const newIndex =
        (selectedUserHistoyIndex + 1 + uniqueSearchHistory.length) %
        uniqueSearchHistory.length;
      setSelectedUserHistoyIndex(newIndex);
    }
  };

  const hotKeysMap: HotKeysType = {
    SEARCH: {
      key: "enter",
      handler: (event: KeyboardEvent<HTMLElement>) => {
        event.preventDefault();

        if (selectedUserHistoyIndex !== null) {
          onSearchAddressHandler(uniqueSearchHistory[selectedUserHistoyIndex]);
          setSelectedUserHistoyIndex(null);
        } else {
          // @ts-ignore
          onSearchAddressHandler(event.target.value);
        }
      },
    },
    ARROWUP: {
      key: "arrowup",
      handler: (event: KeyboardEvent<HTMLElement>) => {
        event.preventDefault();
        moveSelectedIndexUp();
      },
    },
    ARROWDOWN: {
      key: "arrowdown",
      handler: (event: KeyboardEvent<HTMLElement>) => {
        event.preventDefault();
        moveSelectedIndexDown();
      },
    },
  };

  useEffect(() => {
    getUserHistory(user?.uid).then((userHistory) => {
      if (userHistory) {
        setUserHistory(userHistory);
      }
    });
  }, [user]);

  return (
    <>
      <div className={clsx("flex w-full flex-col")}>
        <div className={clsx("flex rounded-md shadow-sm", className)}>
          <div className="flex w-full flex-col">
            <div className="relative flex flex-grow items-stretch focus-within:z-10">
              {/* If the address is loading, show a loading icon. Else, show a magnifying glass instead */}
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>

              {/* The input field */}
              <input
                type="text"
                name="address"
                id="address"
                value={query}
                autoComplete="off"
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  const hotKey = event.key.toLocaleLowerCase();
                  switch (hotKey) {
                    case hotKeysMap.SEARCH.key:
                      hotKeysMap.SEARCH.handler(event);
                      break;
                    case hotKeysMap.ARROWUP.key:
                      hotKeysMap.ARROWUP.handler(event);
                      break;
                    case hotKeysMap.ARROWDOWN.key:
                      hotKeysMap.ARROWDOWN.handler(event);
                      break;
                  }
                }}
                className={
                  "block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 font-mono text-gray-900 ring-1 ring-inset ring-gray-300 transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6" +
                  (isAddressValid || !query
                    ? " focus:ring-blue-600"
                    : " focus:ring-red-500")
                }
                placeholder="0x89c3ef557515934..."
                onFocus={() => {
                  setIsUserHistoryPopoverOpen(true);
                }}
                onBlur={(event) => {
                  // If the popover is open and the user clicks outside of the popover, close the popover
                  if (
                    popoverRef.current &&
                    !popoverRef.current.contains(event.relatedTarget as Node)
                  ) {
                    setIsUserHistoryPopoverOpen(false);
                  }
                }}
              />

              {/* If the address is invalid, show an error icon and a popover*/}
              {!isAddressValid && query ? (
                <div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <XCircleIcon
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              ) : null}
            </div>
            {
              // If the user history popover is open, show the user history popover
              isUserHistoryPopoverOpen && userHistory.length > 0 ? (
                <div ref={popoverRef}>
                  <SearchHistoryPopover
                    userInput={query}
                    onClickAddress={onSearchAddressHandler}
                    userHistory={uniqueSearchHistory}
                    selectedIndex={selectedUserHistoyIndex}
                    setSelectedIndex={setSelectedUserHistoyIndex}
                  />
                </div>
              ) : null
            }

            <Transition
              appear={true}
              show={showInvalidAddressPopover ? true : false}
              enter={`transition-all duration-500`}
              enterFrom="opacity-0 scale-50"
              enterTo="opacity-100 scale-100"
              leave="transition-all duration-500"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-50"
            >
              <InvalidAddressPopover />
            </Transition>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isAddressValid) {
                setIsUserHistoryPopoverOpen(false);
                onSearchAddress(query);
              } else {
                setShowInvalidAddressPopover(true);
              }
            }}
            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50"
          >
            <ArrowUpRightIcon
              className="-ml-0.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Analyze
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
