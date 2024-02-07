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
}

const SearchResultRow = ({
  result,
  selected,
  onClickAddress,
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

  return (
    <div className="relative z-10 w-full">
      <Popover className="absolute w-full">
        <Popover.Panel static>
          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
            <div className="relative flex flex-col bg-white pt-3">
              {results.map((item, index) => (
                <SearchResultRow
                  key={item.address}
                  result={item}
                  onClickAddress={() => {
                    onClickAddress(item.address);
                  }}
                  selected={selectedIndex === index}
                />
              ))}
            </div>
          </div>
        </Popover.Panel>
      </Popover>
    </div>
  );
};

export default SearchResultPopover;
