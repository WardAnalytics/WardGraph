import { Popover } from "@headlessui/react";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { FC } from "react";
import { SearchResult } from "./SearchBar";
import { TagIcon } from "@heroicons/react/16/solid";

import Badge from "../../common/Badge";
import EntityLogo from "../../common/EntityLogo";
import { Colors } from "../../../utils/colors";

interface SearchResultRowProps {
  result: SearchResult;
  selected: boolean;
  onClickAddress: () => void;
  totalResults: number;
  currentIndex: number;
}

const SearchResultRow = ({
  result,
  selected,
  onClickAddress,
  totalResults,
  currentIndex,
}: SearchResultRowProps) => {
  return (
    <div
      className={clsx(
        "flex flex-row items-center gap-x-2 rounded-lg p-1.5 transition duration-[25ms] ease-in-out hover:cursor-pointer hover:bg-gray-100 hover:text-blue-500 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50",
        selected ? "bg-gray-100 text-blue-500" : "ml-1 text-gray-900",
      )}
      onClick={onClickAddress}
    >
      {result.entity ? (
        <div className="h-fit w-fit overflow-hidden rounded-full">
          <EntityLogo
            entity={result.entity}
            className="h-6 w-6"
            aria-hidden="true"
          />
        </div>
      ) : (
        <ArrowPathIcon className="h-3 w-3 text-gray-400" aria-hidden="true" />
      )}
      <p className="font-mono text-xs font-medium">{result.address}</p>
      {result.entity && (
        <Badge text={result.entity} color={Colors.BLUE} Icon={TagIcon} />
      )}
      {selected && (
        <p className="ml-auto mr-2 text-xs text-gray-400">
          {currentIndex + 1}/{totalResults}
        </p>
      )}
    </div>
  );
};

interface SearchResultPopoverProps {
  results: SearchResult[];
  selectedIndex: number | null;
  onClickAddress: (address: string) => void;
}

const SearchResultPopover: FC<SearchResultPopoverProps> = ({
  results,
  onClickAddress,
  selectedIndex,
}) => {
  // If there are no results, don't render the popover at all
  if (results.length === 0) {
    return null;
  }

  // If the selected index is bigger than 3, we want to start scrolling the popover downwards.
  // We only want to display 7 results at a time, and we want to keep the selected index in the middle of the popover unless it's near the bounds.
  const { lowerBound, upperBound } = (() => {
    if (selectedIndex === null) {
      return { lowerBound: 0, upperBound: 7 };
    }

    if (selectedIndex < 3) {
      return { lowerBound: 0, upperBound: 7 };
    }

    if (selectedIndex > results.length - 4) {
      return { lowerBound: results.length - 7, upperBound: results.length };
    }

    return { lowerBound: selectedIndex - 3, upperBound: selectedIndex + 4 };
  })();

  return (
    <div className="relative z-10 w-full">
      <Popover className="absolute w-full">
        <Popover.Panel static>
          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
            <div className="relative flex flex-col bg-white pt-3">
              {results.map(
                (item, index) =>
                  index >= lowerBound &&
                  index < upperBound && (
                    <SearchResultRow
                      key={item.address}
                      result={item}
                      onClickAddress={() => {
                        onClickAddress(item.address);
                      }}
                      selected={selectedIndex === index}
                      totalResults={results.length}
                      currentIndex={index}
                    />
                  ),
              )}
            </div>
          </div>
        </Popover.Panel>
      </Popover>
    </div>
  );
};

export default SearchResultPopover;
