import { Listbox as HUIListbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { FC, Fragment, useState } from "react";

interface ListboxProps {
  options: string[];
  onChange?: (...event: any[]) => void;
  onBlur?: () => void;
  selected: string;
  className?: string;
  placeholder?: string;
}

const Listbox: FC<ListboxProps> = ({
  options,
  onChange = () => {},
  onBlur = () => {},
  selected: selectedProp,
  className,
  placeholder = "Select an option",
}) => {
  // Make this a controlled component
  // More info: https://dommagnifi.co/2023-04-05-controlled-and-uncontrolled-inputs/
  const [selected, setSelected] = useState<string>(selectedProp || placeholder);

  return (
    <HUIListbox
      as="div"
      className={clsx("w-full", className)}
      value={selected}
      onChange={(e) => {
        onChange(e);
        setSelected(e);
      }}
      onBlur={onBlur}
    >
      <div className="relative mt-1">
        <HUIListbox.Button className="focus:ring-inse relative w-full cursor-pointer rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-left text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 transition-all placeholder:text-gray-400 hover:outline hover:outline-[3px] hover:outline-blue-200 hover:ring-2 hover:ring-blue-400">
          <span className="block truncate">{selected}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </HUIListbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <HUIListbox.Options className="scrollbar absolute mt-1 max-h-44 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
            {options.map((option, optionIdx) => (
              <HUIListbox.Option
                key={optionIdx}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                  }`
                }
                value={option}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </HUIListbox.Option>
            ))}
          </HUIListbox.Options>
        </Transition>
      </div>
    </HUIListbox>
  );
};

export default Listbox;
