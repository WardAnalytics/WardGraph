import { FC, useRef, useState, KeyboardEvent, useMemo, useEffect } from "react";

import TagsPopover from "./TagsPopover";
import { HotKeysType } from "../../../../types/hotKeys";

import {
  getCustomAddressesTags,
  storeCustomAddressesTags,
} from "../../../../services/firestore/graph/addresses/custom-tags";
import {
  getCustomUserTags,
  storeCustomUserTags,
} from "../../../../services/firestore/user/custom-tags";
import { PencilIcon } from "@heroicons/react/16/solid";

interface TagInputProps {
  address: string;
  initialTags: string[];
  onCreateCustomAddressTag?: (tag: string) => void;
}

const TagInput: FC<TagInputProps> = ({
  address,
  onCreateCustomAddressTag = () => {},
  initialTags,
}) => {
  // Ref for the popover hotkeys
  const popoverRef = useRef<HTMLDivElement>(null);

  // Current user input
  const [userInput, setUserInput] = useState<string>("");

  // Whether or not to open the popover
  const [isTagsPopoverOpen, setIsTagsPopoverOpen] = useState<boolean>(false);

  // Get existing address tags and user tags
  const [addressCustomTags, setAddressCustomTags] =
    useState<string[]>(initialTags);
  const [userCustomTags, setUserCustomTags] = useState<string[]>([]);

  // Fetch the address and user tags from the database
  async function fetchAddressTags() {
    getCustomAddressesTags(address).then((tags) => {
      setAddressCustomTags(tags);
      console.log("Address tags are ", tags);
    });
  }

  async function fetchUserTags() {
    getCustomUserTags().then((tags) => {
      setUserCustomTags(tags);
      console.log("User tags are ", tags);
    });
  }

  useEffect(() => {
    fetchAddressTags();
    fetchUserTags();
  }, []);

  // Options = user custom tags that include the user input - address custom tags (which already include the user input)
  const { options } = useMemo(() => {
    const options = userCustomTags.filter((tag) =>
      tag.toLowerCase().includes(userInput.toLowerCase()),
    );

    // Must all be unique
    const uniqueOptions = Array.from(new Set(options));

    // Subtract already existing tags from the options
    return {
      options: uniqueOptions.filter((tag) => !addressCustomTags.includes(tag)),
    };
  }, [userInput, addressCustomTags, userCustomTags]);

  // When a tag is created, the user input is cleared and the component above is updated
  const onAddTagHandler = async (input: string) => {
    // If the tag is already in the address tags, return early
    if (addressCustomTags.includes(input)) return;

    onCreateCustomAddressTag(input);

    // Store custom tags in the database
    await storeCustomAddressesTags(address, [...addressCustomTags, input]);
    await storeCustomUserTags([...userCustomTags, input]);

    // Re-fetch the tags
    await fetchAddressTags();
    await fetchUserTags();

    setUserInput("");
  };

  // Hotkeys for moving up and down
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null,
  );
  const moveSelectedIndexUp = () => {
    // If null and there are options, select the last option
    if (selectedOptionIndex === null && options.length > 0) {
      setSelectedOptionIndex(options.length - 1);
      return;
    }

    // If not null, move the selected index up. If it's gonna be negative, set to null
    if (selectedOptionIndex !== null && selectedOptionIndex === 0) {
      setSelectedOptionIndex(null);
      return;
    }

    // If not null and not 0, move the selected index up
    if (selectedOptionIndex !== null) {
      setSelectedOptionIndex(selectedOptionIndex - 1);
    }
  };
  const moveSelectedIndexDown = () => {
    // If null and there are options, select the first option
    if (selectedOptionIndex === null && options.length > 0) {
      setSelectedOptionIndex(0);
      return;
    }

    // If not null, move the selected index down. If it's gonna be greater than the length, set to null
    if (
      selectedOptionIndex !== null &&
      selectedOptionIndex === options.length - 1
    ) {
      setSelectedOptionIndex(null);
      return;
    }

    // If not null and not the last index, move the selected index down
    if (selectedOptionIndex !== null) {
      setSelectedOptionIndex(selectedOptionIndex + 1);
    }
  };

  const hotKeysMap: HotKeysType = {
    SEARCH: {
      key: "enter",
      asyncHandler: async (event: KeyboardEvent<HTMLElement>) => {
        event.preventDefault();

        // If an option is selected, use that. Else, use the written user input
        const input: string =
          selectedOptionIndex === null
            ? userInput
            : options[selectedOptionIndex];

        await onAddTagHandler(input);
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
    <div ref={popoverRef} className="w-fit items-center">
      <input
        type="text"
        value={userInput}
        onChange={(event) => {
          setUserInput(event.target.value);
          setSelectedOptionIndex(null);
        }}
        onKeyDown={async (event) => {
          const hotKey = event.key.toLocaleLowerCase();
          switch (hotKey) {
            case hotKeysMap.SEARCH.key:
              await hotKeysMap.SEARCH.asyncHandler!(event);
              break;
            case hotKeysMap.ARROWUP.key:
              hotKeysMap.ARROWUP.handler!(event);
              break;
            case hotKeysMap.ARROWDOWN.key:
              hotKeysMap.ARROWDOWN.handler!(event);
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
        className="w-32 rounded-md border-0 py-[0.04rem] pl-5 text-xs font-semibold leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 transition-all placeholder:text-gray-400 focus:outline focus:outline-[3px] focus:outline-blue-200 focus:ring-2 focus:ring-blue-400"
      />
      <PencilIcon
        className="absolute -mt-[1.15rem] ml-1.5 h-3 w-3 text-gray-400"
        aria-hidden="true"
      />
      {isTagsPopoverOpen && (
        <TagsPopover
          input={userInput}
          options={options}
          selectedOptionIndex={selectedOptionIndex}
          addTag={onAddTagHandler}
        />
      )}
    </div>
  );
};

export default TagInput;
