import { Popover } from "@headlessui/react";
import { FC, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

interface SearchHistoryPopoverProps {
    userInput: string;
    setUserInput: (input: string) => void;
    userHistory: string[];
}

const SearchHistoryPopover: FC<SearchHistoryPopoverProps> = ({
    userInput,
    setUserInput,
    userHistory
}) => {
    const filteredUserSearchHistory = useMemo(() => {
        const userHistoryObject = userHistory.map((address) => {
            return {
                id: uuidv4(),
                address,
            };
        });

        // Filter out if the address contains the user input
        return userHistoryObject.filter(
            (item) => item.address.toLowerCase().indexOf(userInput.toLowerCase()) !== -1
        );
    }, [userHistory, userInput]);

    console.log("Filtered user search history: ", filteredUserSearchHistory);

    return (
        filteredUserSearchHistory.length > 0 && (
            <div className="relative w-full z-10">
                <Popover className="absolute w-full">
                    <Popover.Panel static>
                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                            <div className="relative flex flex-col gap-8 bg-white p-5">
                                {filteredUserSearchHistory.map((item) => (
                                    <div
                                        key={item.id}
                                        className="-m-3 flex items-center justify-between rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50 hover:cursor-pointer text-gray-900 hover:text-blue-500"
                                        onClick={() => {
                                            setUserInput(item.address);
                                        }}
                                    >
                                        <p className="text-sm font-medium">
                                            {item.address}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Popover.Panel>
                </Popover>
            </div >
        )
    );
}

export default SearchHistoryPopover;