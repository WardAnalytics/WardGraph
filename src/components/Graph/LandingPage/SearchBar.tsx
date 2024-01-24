import { FC, useState, useMemo } from "react";
import clsx from "clsx";
import { Transition } from "@headlessui/react";
import {
  MagnifyingGlassIcon,
  ArrowUpRightIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

import isValidAddress from "../../../utils/isValidAddress";
import { HotKeysType } from "../../../types/hotKeys";

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

interface SearchbarProps {
  className?: string;
  onSearchAddress: (address: string) => void;
}

const Searchbar: FC<SearchbarProps> = ({ className, onSearchAddress }) => {
  const [query, setQuery] = useState<string>("");

  const isAddressValid = useMemo(() => isValidAddress(query), [query]);

  const onSearchAddressHandler = () => {
    if (isAddressValid) {
      onSearchAddress(query);
    }
  };

  const hotKeysMap: HotKeysType = {
    SEARCH: {
      key: "enter",
      handler: (event) => {
        event.preventDefault();
        onSearchAddressHandler();
      },
    },
  };

  return (
    <div className={clsx("flex rounded-md shadow-sm", className)}>
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
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            const hotKey = event.key.toLocaleLowerCase();
            switch (hotKey) {
              case hotKeysMap.SEARCH.key:
                hotKeysMap.SEARCH.handler(event);
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

        <Transition
          appear={true}
          show={!isAddressValid && query ? true : false}
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
          if (isAddressValid) onSearchAddress(query);
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
  );
};

export default Searchbar;
