import { Popover, Transition } from "@headlessui/react";
import { PlusIcon, TagIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { FC, Fragment } from "react";

interface CreateNewTagRowProps {
  tag: string;
  onClick: () => Promise<void>;
  selected: boolean;
}

const CreateNewTagRow: FC<CreateNewTagRowProps> = ({
  onClick,
  selected,
  tag,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-row items-center gap-x-2 rounded-lg p-2 duration-0 hover:cursor-pointer hover:bg-gray-100 hover:text-blue-500 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50",
        selected ? "bg-gray-100 text-blue-500" : "text-gray-900",
      )}
      onClick={onClick}
    >
      <PlusIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      <p className="text-sm font-medium">New: {tag}</p>
    </div>
  );
};

interface TagsRowProps {
  onClick: () => Promise<void>;
  selected: boolean;
  tag: string;
}

const TagsRow: FC<TagsRowProps> = ({ onClick, selected, tag }) => {
  return (
    <div
      className={clsx(
        "flex flex-row items-center gap-x-2 rounded-lg p-2 hover:cursor-pointer hover:bg-gray-100 hover:text-blue-500 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50",
        selected ? "bg-gray-100 text-blue-500" : "text-gray-900",
      )}
      onClick={onClick}
    >
      <TagIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      <p className="text-sm font-medium">{tag}</p>
    </div>
  );
};

interface TagsPopoverProps {
  input: string;
  options: string[];
  selectedOptionIndex: number | null;
  addTag: (input: string) => Promise<void>;
}

const TagsPopover: FC<TagsPopoverProps> = ({
  input,
  options,
  selectedOptionIndex,
  addTag,
}) => {
  return (
    <Transition
      appear={true}
      show={true}
      as={Fragment}
      enter="transition-all duration-300 ease-in-out"
      enterFrom="opacity-0 -translate-y-5"
      enterTo="opacity-100 translate-y-0"
    >
      <Popover
        className="absolute z-50 h-fit w-44 overflow-y-hidden rounded-md shadow-lg ring-1 ring-gray-400"
        id="tags-popover"
      >
        <Popover.Panel static>
          <div className="max-h-96 overflow-x-hidden overflow-y-hidden rounded-lg shadow-lg ring-1 ring-black/5">
            <div className="relative flex flex-col bg-white pt-3">
              <>
                <CreateNewTagRow
                  tag={input}
                  onClick={async () => await addTag(input)}
                  selected={selectedOptionIndex === null}
                />
                {options.map((tag) => (
                  <TagsRow
                    key={tag}
                    tag={tag}
                    onClick={async () => await addTag(tag)}
                    selected={selectedOptionIndex === options.indexOf(tag)}
                  />
                ))}
              </>
            </div>
          </div>
        </Popover.Panel>
      </Popover>
    </Transition>
  );
};

export default TagsPopover;
