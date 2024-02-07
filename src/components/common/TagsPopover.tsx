import { Popover } from "@headlessui/react";
import { TagIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { FC } from "react";

interface TagsRowRowProps {
    tag: string;
    onClickTags: (input: string) => void;
    selected: boolean;
}

const TagsRow = ({
    tag,
    onClickTags,
    selected,
}: TagsRowRowProps) => {
    return (
        <div
            className={clsx(
                "flex flex-row items-center gap-x-2 rounded-lg p-2 transition duration-150 ease-in-out hover:cursor-pointer hover:bg-gray-100 hover:text-blue-500 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50",
                selected ? "bg-gray-100 text-blue-500" : "text-gray-900",
            )}
            onClick={() => onClickTags(tag)}
        >
            <TagIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            <p className="font-mono text-sm font-medium">{tag}</p>
        </div>
    );
};

interface TagsPopoverProps {
    tags: string[];
    onClickTags: (input: string) => void;
    selectedIndex: number | null;
}

const TagsPopover: FC<TagsPopoverProps> = ({
    tags,
    onClickTags,
    selectedIndex,
}) => {
    return <div className="relative z-10 w-full">
        <Popover className="absolute w-full">
            <Popover.Panel static>
                <div className="overflow-x-hidden overflow-y-scroll scrollbar-hide rounded-lg shadow-lg ring-1 ring-black/5 max-h-96">
                    <div className="relative flex flex-col bg-white pt-3">
                        {tags.map((tag) => (
                            <TagsRow
                                key={tag}
                                tag={tag}
                                onClickTags={onClickTags}
                                selected={selectedIndex === tags.indexOf(tag)} />
                        ))}
                    </div>
                </div>
            </Popover.Panel>
        </Popover>
    </div>;
}

export default TagsPopover;