import { Combobox as HUICombobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import clsx from "clsx";
import { FC, Fragment, useState } from "react";

interface ComboboxProps {
    options: string[];
    onChange?: (...event: any[]) => void;
    onBlur?: () => void;
    selected: string;
    className?: string;
    placeholder?: string;
}

const Combobox: FC<ComboboxProps> = ({
    options,
    onChange = () => { },
    onBlur = () => { },
    selected: selectedProp,
    className,
    placeholder = 'Select an option'
}) => {
    // Make this a controlled component
    // More info: https://dommagnifi.co/2023-04-05-controlled-and-uncontrolled-inputs/
    const [selected, setSelected] = useState<string>(selectedProp)
    const [query, setQuery] = useState<string>('')

    const filteredOptions =
        query === ''
            ? options
            : options.filter((option) =>
                option
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            )

    return (
        <HUICombobox
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
                <div className="relative w-full cursor-cursor overflow-hidden rounded-md bg-white text-left text-sm leading-6 text-gray-900 ring-1 ring-gray-300 transition-all placeholder:text-gray-400 ">
                    <HUICombobox.Input
                        className="block w-full rounded-md border-0 py-1.5 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-inset"
                        displayValue={(option: string) => option}
                        placeholder={placeholder}
                        onChange={(e) => {
                            setQuery(e.target.value)
                        }}
                    />
                    <HUICombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </HUICombobox.Button>
                </div>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery('')}
                >
                    <HUICombobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm scrollbar">
                        {filteredOptions.length === 0 && query !== '' ? (
                            <div className="relative cursor-pointer select-none px-4 py-2 text-gray-700">
                                Nothing found.
                            </div>
                        ) : (
                            filteredOptions.map((option, optionIdx) => (
                                <HUICombobox.Option
                                    key={optionIdx}
                                    className={({ active }) =>
                                        `relative
                                            cursor-pointer
                                            select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                                        }`
                                    }
                                    value={option}
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                    }`}
                                            >
                                                {option}
                                            </span>
                                            {selected ? (
                                                <span
                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-blue-600'
                                                        }`}
                                                >
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </HUICombobox.Option>
                            ))
                        )}
                    </HUICombobox.Options>
                </Transition>
            </div>
        </HUICombobox >
    )
}

export default Combobox;
