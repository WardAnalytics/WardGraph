import { Transition } from "@headlessui/react";
import {
  ArrowUpRightIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { FC, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

import { useSearchLabels } from "../../../api/labels/labels";
import { Label } from "../../../api/model";

import { useSearchHistory } from "../../../services/firestore/user/search_history/search_history";

import { HotKeysType } from "../../../types/hotKeys";

import useAuthState from "../../../hooks/useAuthState";
import { logAnalyticsEvent } from "../../../services/firestore/analytics/analytics";
import isValidAddress from "../../../utils/isValidAddress";
import SearchResultPopover from "./SearchResultPopover";

const InvalidAddressPopover: FC = () => {
  return (
    <div className="ring-300 absolute top-full mt-2 w-72 translate-x-[32rem] transform rounded-md bg-red-100 p-3 shadow-lg ring-1 ring-red-300 transition-opacity duration-300">
      <span className="flex items-center space-x-2">
        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        <h3 className="text-sm font-medium text-red-800">Invalid Address</h3>
      </span>
      <div className="mt-2 space-y-2 text-sm text-red-700">
        <p>
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

// The search bar will calculate a list of search results based on the user's input, mixing past search results and entities like Binance, Uniswap, etc.
export interface SearchResult {
  address: string;
  entity?: string; // If there is no entity, it's a past search result and should display an icon instead
}

interface SearchBarProps {
  className?: string;
  onSearchAddress: (address: string) => void;
}

const MAX_SEARCH_HISTORY = 50;

const SearchBar: FC<SearchBarProps> = ({ className, onSearchAddress }) => {
  const popoverRef = useRef<HTMLDivElement>(null); // Popover ref for hotkeys
  const { user } = useAuthState();
  const { mutate: searchLabels } = useSearchLabels({
    mutation: {
      onSuccess: (data) => {
        if (data.labels) {
          setEntitySearchResults(data.labels);
        } else {
          setEntitySearchResults([]);
        }
      },
    },
  });

  // The current query the user is typing
  const [query, setQuery] = useState<string>("");

  // Whether or not to open the popover
  const [isSearchResultPopoverOpen, setIsSearchResultPopoverOpen] =
    useState(false);

  // Whether the currently searched address is valid
  const isAddressValid = useMemo(() => isValidAddress(query), [query]);

  const { searchHistory } = useSearchHistory(user ? user.uid : "");
  const filteredSearchHistory = useMemo(
    // Filter so that only results that include the query are shown
    () =>
      searchHistory.filter((address) =>
        address.toLowerCase().includes(query.toLowerCase()),
      ),
    [searchHistory, query],
  );

  // Entity search results
  const [entitySearchResults, setEntitySearchResults] = useState<Label[]>([]);

  useEffect(() => {
    if (!query) {
      setEntitySearchResults([]);
      return;
    }

    // If the query is the same as the last time searched, don't search again
    searchLabels({
      data: {
        query,
        limit: MAX_SEARCH_HISTORY,
      },
    });
  }, [query]);

  // Combine uniqueSearchHistory and entitySearchResults into a single list of search results
  const searchResults: SearchResult[] = useMemo(() => {
    let results: SearchResult[] = [];

    // Add past search results
    results = filteredSearchHistory.map((address) => ({
      address,
    }));

    // Add entity search results
    results = results.concat(
      entitySearchResults.map((label) => ({
        address: label.address,
        entity: label.label,
      })),
    );

    // Now remove duplicate addresses
    results = results.filter(
      (result, index, self) =>
        index ===
        self.findIndex(
          (t) => t.address.toLowerCase() === result.address.toLowerCase(),
        ),
    );

    // Now limit to MAX_SEARCH_HISTORY results
    results = results.slice(0, MAX_SEARCH_HISTORY);

    return results;
  }, [filteredSearchHistory, entitySearchResults]);

  // When an address is searched, make sure one last time that the address is valid
  const onSearchAddressHandler = (input: string) => {
    if (isValidAddress(input)) {
      onSearchAddress(input);
      logAnalyticsEvent("search_address_clicked", { address: input });
    }
  };

  // Functions for moving the selected index up and down
  const [selectedResultIndex, setSelectedResultIndex] = useState<number | null>(
    null,
  );

  const moveSelectedIndexUp = () => {
    if (selectedResultIndex === null) {
      setSelectedResultIndex(0);
    } else {
      const newIndex =
        (selectedResultIndex - 1 + searchResults.length) % searchResults.length;
      setSelectedResultIndex(newIndex);
    }
  };
  const moveSelectedIndexDown = () => {
    if (selectedResultIndex === null) {
      setSelectedResultIndex(0);
    } else {
      const newIndex =
        (selectedResultIndex + 1 + searchResults.length) % searchResults.length;
      setSelectedResultIndex(newIndex);
    }
  };

  // Hotkeys for moving up and down
  const hotKeysMap: HotKeysType = {
    SEARCH: {
      key: "enter",
      handler: (event: KeyboardEvent<HTMLElement>) => {
        event.preventDefault();

        if (selectedResultIndex !== null) {
          onSearchAddressHandler(searchResults[selectedResultIndex].address);
          setSelectedResultIndex(null);
        } else {
          // @ts-ignore
          onSearchAddressHandler(event.target.value);
        }
        logAnalyticsEvent("search_address_enter_pressed", {
          address: query,
        });
      },
    },
    ARROWUP: {
      key: "arrowup",
      handler: (event: KeyboardEvent<HTMLElement>) => {
        event.preventDefault();
        moveSelectedIndexUp();
        logAnalyticsEvent("move_selected_index", {
          page: "search_bar",
          direction: "up",
        });
      },
    },
    ARROWDOWN: {
      key: "arrowdown",
      handler: (event: KeyboardEvent<HTMLElement>) => {
        event.preventDefault();
        moveSelectedIndexDown();
        logAnalyticsEvent("move_selected_index", {
          page: "search_bar",
          direction: "down",
        });
      },
    },
  };

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
                      hotKeysMap.SEARCH.handler!(event);
                      break;
                    case hotKeysMap.ARROWUP.key:
                      hotKeysMap.ARROWUP.handler!(event);
                      break;
                    case hotKeysMap.ARROWDOWN.key:
                      hotKeysMap.ARROWDOWN.handler!(event);
                      break;
                  }
                }}
                className={
                  "block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 font-mono text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 transition-all placeholder:text-gray-400 focus:outline focus:outline-[3px] focus:ring-2" +
                  (isAddressValid || !query || searchResults.length !== 0
                    ? " focus:outline-blue-200 focus:ring-blue-400"
                    : "  focus:outline-red-200 focus:ring-red-400")
                }
                placeholder="Entity, domain.eth, or 0x89c3ef557515934..."
                onFocus={() => {
                  setIsSearchResultPopoverOpen(true);
                }}
                onBlur={(event) => {
                  // If the popover is open and the user clicks outside of the popover, close the popover
                  if (
                    popoverRef.current &&
                    !popoverRef.current.contains(event.relatedTarget as Node)
                  ) {
                    setIsSearchResultPopoverOpen(false);
                  }
                }}
              />

              {/* If the address is invalid, show an error icon and a popover*/}
              {isAddressValid || !query || searchResults.length !== 0 ? null : (
                <div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <XCircleIcon
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              )}
            </div>
            {
              // If the user history popover is open, show the user history popover
              isSearchResultPopoverOpen && searchResults.length > 0 ? (
                <div ref={popoverRef}>
                  <SearchResultPopover
                    results={searchResults}
                    selectedIndex={selectedResultIndex}
                    onClickAddress={onSearchAddressHandler}
                  />
                </div>
              ) : null
            }

            <Transition
              appear={true}
              show={
                !isAddressValid &&
                query.length > 0 &&
                searchResults.length === 0
              }
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
                setIsSearchResultPopoverOpen(false);
                onSearchAddress(query);
                logAnalyticsEvent("search_address_button_clicked", {
                  address: query,
                });
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
