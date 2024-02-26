import { FC, KeyboardEvent, useMemo, useRef, useState } from "react";

import { HotKeysType } from "../../../../types/hotKeys";
import TagsPopover from "./TagsPopover";

import { PencilIcon } from "@heroicons/react/16/solid";
import { logAnalyticsEvent } from "../../../../services/firestore/analytics/analytics";

interface TagInputProps {
  currentAddressTags: string[];
  currentUserTags: string[];
  onCreateCustomAddressTag: (tag: string) => Promise<void>;
  onDeleteCustomAddressTag: (tag: string) => Promise<void>;
}

const TagInput: FC<TagInputProps> = ({
  currentAddressTags,
  currentUserTags,
  onCreateCustomAddressTag,
  onDeleteCustomAddressTag,
}) => {
  // Ref for the popover hotkeys
  const popoverRef = useRef<HTMLDivElement>(null);

  // Current user input
  const [userInput, setUserInput] = useState<string>("");

  // Whether or not to open the popover
  const [isTagsPopoverOpen, setIsTagsPopoverOpen] = useState<boolean>(false);

  // Options = user custom tags that include the user input - address custom tags (which already include the user input)
  const { options } = useMemo(() => {
    const options = currentUserTags.filter((tag) =>
      tag.toLowerCase().includes(userInput.toLowerCase()),
    );

    // Must all be unique
    const uniqueOptions = Array.from(new Set(options));

    // Subtract already existing tags from the options
    return {
      options: uniqueOptions.filter((tag) => !currentAddressTags.includes(tag)),
    };
  }, [userInput, currentAddressTags, currentUserTags]);

  // When a tag is created, the user input is cleared and the component above is updated
  const onAddTagHandler = async (input: string) => {
    // If the tag is already in the address tags, return early
    if (currentAddressTags.includes(input)) {
      setUserInput("");
      return;
    }

    // If tag is "" or null, return early
    if (!input) return;

    await onCreateCustomAddressTag(input);
    setUserInput("");
    logAnalyticsEvent("create_custom_address_tag", { tag: input });
  };

  const onDeleteTagHandler = async (tag: string) => {
    await onDeleteCustomAddressTag(tag);
    logAnalyticsEvent("delete_custom_address_tag", { tag });
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

  // Hotkeys for the tag input
  // Enter: Add tag
  // ArrowUp: Move selected index up
  // ArrowDown: Move selected index down
  // Backspace: Delete last tag
  // Escape: Unfocus input
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
        logAnalyticsEvent("create_custom_address_tag_enter_key_pressed", { tag: input });
      },
    },
    ARROWUP: {
      key: "arrowup",
      handler: (event: KeyboardEvent<HTMLElement>) => {
        event.preventDefault();
        moveSelectedIndexUp();
        logAnalyticsEvent("move_selected_index", { page: "tag_input", direction: "up" });
      },
    },
    ARROWDOWN: {
      key: "arrowdown",
      handler: (event: KeyboardEvent<HTMLElement>) => {
        event.preventDefault();
        moveSelectedIndexDown();
        logAnalyticsEvent("move_selected_index", { page: "tag_input", direction: "down" });
      },
    },
    BACKSPACE: {
      key: "backspace",
      handler: (event: KeyboardEvent<HTMLElement>) => {
        if (userInput === "") {
          event.preventDefault();
          if (currentAddressTags.length > 0) {
            onDeleteTagHandler(
              currentAddressTags[currentAddressTags.length - 1],
            );
          }
        }
      },
    },
    ESCAPE: {
      key: "escape",
      handler: (event: KeyboardEvent<HTMLElement>) => {
        event.preventDefault();
        // Unfocus the input
        event.currentTarget.blur();
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
            case hotKeysMap.BACKSPACE.key:
              hotKeysMap.BACKSPACE.handler!(event);
              break;
            case hotKeysMap.ARROWUP.key:
              hotKeysMap.ARROWUP.handler!(event);
              break;
            case hotKeysMap.ARROWDOWN.key:
              hotKeysMap.ARROWDOWN.handler!(event);
              break;
            case hotKeysMap.ESCAPE.key:
              hotKeysMap.ESCAPE.handler!(event);
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
