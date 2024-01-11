import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { FC, useState } from "react";
import Button from "./Button";

const Searchbar: FC = () => {
    const [query, setQuery] = useState<string>("")

    const resetQuery = () => {
        setQuery("")
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log(query)
        resetQuery()
    }

    return <>
        <form onSubmit={onSubmit} className="flex flex-col gap-7 justify-center w-3/4 sm:w-1/2">
            <div>
                <div className="flex justify-end w-full py-1 flex-wrap items-stretch relative bg-white border border-solid rounded-full">
                    <input
                        type="text"
                        className="absolute block text-center min-w-full flex-auto rounded border border-none bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal text-neutral-700 outline-none transition duration-200 ease-in-out placeholder:text-center focus:placeholder:opacity-0 focus:ring-0 focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
                        placeholder="Search any Ethereum address..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)} />
                    <span
                        className="relative z-3 px-3 py-1.5">
                        {
                            query.length > 0 ?
                                <XMarkIcon className="w-4 h-4 text-gray-400 hover:cursor-pointer" aria-hidden="true" onClick={resetQuery} /> :
                                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" aria-hidden="true" />
                        }
                    </span>
                </div>
            </div>
            <div className="flex justify-center w-full">
                <div className="flex flex-col justify-center w-full sm:w-2/3 sm:flex-row">
                    <Button type="submit" text="Search" className="sm:w-1/2 p-2 mr-2 bg-ward-blue text-sm text-white" />
                    <Button type="submit" text="I'm Feeling Lucky" className="sm:w-1/2 p-2 ml-2 border ring-1 ring-ward-blue/50 bg-white text-sm text-ward-blue  dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600" />
                </div>
            </div>
        </form>

    </>;
}

export default Searchbar;