import { Listbox as HUIListbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
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
    onChange = () => { },
    onBlur = () => { },
    selected: selectedProp,
    className,
    placeholder = 'Select an option'
}) => {
    // Make this a controlled component
    // More info: https://dommagnifi.co/2023-04-05-controlled-and-uncontrolled-inputs/
    const [selected, setSelected] = useState<string>(selectedProp || placeholder)

    return (
        <HUIListbox
            as="div"
            className={clsx("w-full", className)}
            value={selected}
            onChange={(e) => {
                onChange(e)
                setSelected(e)
            }}
            onBlur={onBlur}
        >
            <div className="relative mt-1">
                <HUIListbox.Button
                    className="relative w-full cursor-pointer bg-white py-2 pl-3 pr-10 text-left sm:text-sm rounded-md border-0 py-1.5 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-inset"
                >
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
                    <HUIListbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm scrollbar">
                        {options.map((option, optionIdx) => (
                            <HUIListbox.Option
                                key={optionIdx}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                    }`
                                }
                                value={option}
                            >
                                {({ selected }) => (
                                    <>
                                        <span
                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                }`}
                                        >
                                            {option}
                                        </span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
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
    )
}

export default Listbox