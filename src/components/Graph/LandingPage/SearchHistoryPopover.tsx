import { Popover } from "@headlessui/react";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { FC, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface SearchHistoryRowProps {
  address: string;
  setUserInput: (input: string) => void;
  selected: boolean;
}

const SearchHistoryRow = ({
  address,
  setUserInput,
  selected,
}: SearchHistoryRowProps) => {
  return (
    <div
      className={clsx(
        "flex flex-row items-center gap-x-2 rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-blue-500 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50",
        selected ? "bg-gray-100 text-blue-500" : "text-gray-900",
      )}
      onClick={() => {
        setUserInput(address);
      }}
    >
      <ArrowPathIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      <p className="font-mono text-sm font-medium">{address}</p>
    </div>
  );
};

interface SearchHistoryPopoverProps {
  userInput: string;
  setUserInput: (input: string) => void;
  userHistory: string[];
}

const SearchHistoryPopover: FC<SearchHistoryPopoverProps> = ({
  userInput,
  setUserInput,
  userHistory,
}) => {
  const filteredUserSearchHistory = useMemo(() => {
    const userHistoryObject = userHistory.map((address) => {
      return {
        id: uuidv4(),
        address,
      };
    });

    // Filter out if the address contains the user input
    const lowerCasedHistory = userHistoryObject.filter(
      (item) =>
        item.address.toLowerCase().indexOf(userInput.toLowerCase()) !== -1,
    );

    // Remove duplicates
    const uniqueHistory = lowerCasedHistory.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) => t.address.toLowerCase() === item.address.toLowerCase(),
        ),
    );

    return uniqueHistory;
  }, [userHistory, userInput]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    filteredUserSearchHistory.length > 0 && (
      <div className="relative z-10 w-full">
        <Popover className="absolute w-full">
          <Popover.Panel static>
            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
              <div className="relative flex flex-col bg-white pt-3">
                {filteredUserSearchHistory.map((item) => (
                  <SearchHistoryRow
                    key={item.id}
                    address={item.address}
                    setUserInput={setUserInput}
                    selected={
                      selectedIndex === filteredUserSearchHistory.indexOf(item)
                    }
                  />
                ))}
              </div>
            </div>
          </Popover.Panel>
        </Popover>
      </div>
    )
  );
};

export default SearchHistoryPopover;
