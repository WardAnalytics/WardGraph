import { Popover } from "@headlessui/react";
import { FC } from "react";
import { Link } from "react-router-dom";

interface SearchHistoryPopoverProps {
    userHistory: string[];
}

const SearchHistoryPopover: FC<SearchHistoryPopoverProps> = ({ userHistory }) => {

    return (
        <Popover
            className="absolute z-10 mt-2 w-96 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
            <div className="px-4 py-3">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Search History
                </h3>
            </div>
            <div className="py-1">
                {userHistory?.map((address) => (
                    <div key={address} className="px-4 py-2">
                        <Link
                            to={`/graph/${address}`}
                            className="block text-sm font-medium text-gray-900"
                        >
                            {address}
                        </Link>
                    </div>
                ))}
            </div>
        </Popover>
    );
}

export default SearchHistoryPopover;