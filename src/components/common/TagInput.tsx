// This component uses react-select to create a label input field
// More info: https://react-select.com/creatable

import { FC, useEffect, useMemo, useRef, useState } from 'react';


import { getCustomAddressesTags } from "../../services/firestore/graph/addresses/custom-tags";
import TagsPopover from './TagsPopover';

interface TagInputProps {
    address: string;
    options?: string[];
    onCreateCustomAddressTag: (tag: string) => void;
}

const TagInput: FC<TagInputProps> = ({
    address,
    options,
    onCreateCustomAddressTag,
}) => {
    const popoverRef = useRef<HTMLDivElement>(null);

    const [userCustomAddressTags, setUserCustomAddressTags] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState<string>("");
    const [isTagsPopoverOpen, setIsTagsPopoverOpen] = useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const filteredCustomAddressTags = useMemo(() => {
        return options || []
    }, [options, userCustomAddressTags]);

    const onSelectTagHandler = (input: string) => {
        onCreateCustomAddressTag(input);
        setIsTagsPopoverOpen(false);
    };

    useEffect(() => {
        const fetchCustomAddressLabels = async () => {
            const customAddressLabels = await getCustomAddressesTags(address);
            setUserCustomAddressTags(customAddressLabels);
        };

        fetchCustomAddressLabels();
    }, [address]);

    return (
        <>
            <input
                type="text"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
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
                isTagsPopoverOpen && filteredCustomAddressTags.length > 0 ? (
                    <div ref={popoverRef}>
                        <TagsPopover
                            tags={filteredCustomAddressTags}
                            onClickTags={onSelectTagHandler}
                            selectedIndex={selectedIndex} />
                    </div>
                ) : null
            }
        </>
    );
}

export default TagInput;
