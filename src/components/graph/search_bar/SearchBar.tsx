import { Transition } from "@headlessui/react";
import {
  ArrowUpRightIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { FC, KeyboardEvent, useMemo, useRef, useState, useEffect } from "react";

import { Label, SearchLabelsBody } from "../../../api/model";
import { searchLabels } from "../../../api/labels/labels";

import authService from "../../../services/auth/auth.services";
import { getUserHistory } from "../../../services/firebase/search-history/search-history";

import { HotKeysType } from "../../../types/hotKeys";

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

// The search bar will calculate a list of search results based on the user's input, mixing past search results and entities like Binance, Uniswap, etc.
export interface SearchResult {
  address: string;
  entity?: string; // If there is no entity, it's a past search result and should display an icon instead
}

interface SearchBarProps {
  className?: string;
  onSearchAddress: (address: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ className, onSearchAddress }) => {
  const popoverRef = useRef<HTMLDivElement>(null); // Popever ref for hotkeys
  const { user } = authService.useAuthState(); // Current user

  // The current query the user is typing
  const [query, setQuery] = useState<string>("");

  // Whether or not to open the popover
  const [isSearchResultPopoverOpen, setIsSearchResultPopoverOpen] =
    useState(false);

  // Whether the currently searched address is valid
  const isAddressValid = useMemo(() => isValidAddress(query), [query]);

  const [userSearchHistory, setUserSearchHistory] = useState<string[]>([]); // User search history

  // Unique search history of the user's past searches
  useEffect(() => {
    if (user === null) return;

    async function fetchUserHistory() {
      const userHistory = await getUserHistory(user!.uid);

      // Remove duplicates
      const uniqueSearchHistory = userHistory.filter(
        (value, index, self) => self.indexOf(value) === index,
      );

      // Now filter by query
      const filteredHistory = uniqueSearchHistory.filter((address) =>
        address.toLowerCase().includes(query.toLowerCase()),
      );

      setUserSearchHistory(filteredHistory);
    }

    fetchUserHistory();
  }, [query, user]);

  // Entity search results
  const [entitySearchResults, setEntitySearchResults] = useState<Label[]>([]);

  useEffect(() => {
    if (!query) {
      setEntitySearchResults([]);
      return;
    }

    const body: SearchLabelsBody = {
      query: query,
      limit: 7,
    };

    async function fetchLabels() {
      const res = await searchLabels(body);
      if (res.labels) {
        setEntitySearchResults(res.labels);
        console.log(res.labels);
      } else {
        setEntitySearchResults([]);
      }
    }

    fetchLabels();
  }, [query]);

  // Combine uniqueSearchHistory and entitySearchResults into a single list of search results
  const searchResults: SearchResult[] = useMemo(() => {
    let results: SearchResult[] = [];

    // Add past search results
    results = userSearchHistory.map((address) => ({
      address,
    }));

    console.log("Unique search history: ", userSearchHistory);

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

    // Now limit to 10 results
    results = results.slice(0, 7);

    return results;
  }, [userSearchHistory, entitySearchResults]);

  // When an address is searched, make sure one last time that the address is valid
  const onSearchAddressHandler = (input: string) => {
    if (isValidAddress(input)) {
      onSearchAddress(input);
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
                  "block w-full rounded-none rounded-l-md border-0  py-1.5 pl-10 font-mono text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 transition-all placeholder:text-gray-400 focus:outline focus:outline-[3px] focus:ring-2" +
                  (isAddressValid || !query || searchResults.length !== 0
                    ? " focus:outline-blue-200 focus:ring-blue-400"
                    : "  focus:outline-red-200 focus:ring-red-400")
                }
                placeholder="0x89c3ef557515934..."
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
