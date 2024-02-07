// This component uses react-select to create a label input field
// More info: https://react-select.com/creatable

import { FC, useRef, useState, KeyboardEvent } from 'react';


import TagsPopover from './TagsPopover';
import { HotKeysType } from '../../types/hotKeys';

interface TagInputProps {
    options: string[];
    addressCustomTags?: string[];
    onCreateCustomAddressTag: (tag: string) => void;
}

const TagInput: FC<TagInputProps> = ({
    options,
    addressCustomTags,
    onCreateCustomAddressTag,
}) => {
    const popoverRef = useRef<HTMLDivElement>(null);

    const [userInput, setUserInput] = useState<string>("");
    const [isTagsPopoverOpen, setIsTagsPopoverOpen] = useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const onSelectTagHandler = (input: string) => {
        onCreateCustomAddressTag(input);
        setUserInput("");
    };

    const moveSelectedIndexUp = () => {
        const newIndex =
            (selectedIndex - 1 + options.length) % options.length;
        setSelectedIndex(newIndex);

    };
    const moveSelectedIndexDown = () => {
        const newIndex =
            (selectedIndex + 1 + options.length) % options.length;
        setSelectedIndex(newIndex);
    };

    // Hotkeys for moving up and down
    const hotKeysMap: HotKeysType = {
        SEARCH: {
            key: "enter",
            handler: (event: KeyboardEvent<HTMLElement>) => {
                event.preventDefault();
                if (userInput && !options.includes(userInput)) {
                    onCreateCustomAddressTag(userInput);
                    setUserInput("");
                } else
                    onSelectTagHandler(userInput);
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
            <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
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
                onFocus={() => {
                    setIsTagsPopoverOpen(true);
                }}
                onBlur={(event) => {
                    // If the popover is open and the user clicks outside of the popover, close the popover
                    if (
                        popoverRef.current &&
                        !popoverRef.current.contains(event.relatedTarget as Node)
                    ) {
                        setIsTagsPopoverOpen(false);
                    }
                }}
            />
            {
                isTagsPopoverOpen && options && options.length > 0 ? (
                    <div ref={popoverRef}>
                        <TagsPopover
                            userInput={userInput}
                            tags={options}
                            addressCustomTags={addressCustomTags}
                            onClickTags={onSelectTagHandler}
                            selectedIndex={selectedIndex} />
                    </div>
                ) : null
            }
        </>
    );
}

export default TagInput;
