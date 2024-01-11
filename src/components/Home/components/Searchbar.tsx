import { XMarkIcon } from "@heroicons/react/24/solid";
import { FC, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { LuClover } from "react-icons/lu";
import { MdArrowOutward } from "react-icons/md";
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
        <form onSubmit={onSubmit} className="flex flex-col gap-7 justify-center w-full">
            <div className="flex justify-center w-full">
                <div className="flex w-full justify-end text-xs sm:text-sm p-1 flex-wrap items-stretch relative bg-white border border-solid rounded">
                    <input
                        type="text"
                        className="absolute block text-center text-sm xl:text-base w-full flex-auto rounded border border-none bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal text-neutral-700 outline-none transition duration-200 ease-in-out placeholder:text-center focus:placeholder:opacity-0 focus:ring-0 focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
                        placeholder="Search any Ethereum address..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)} />
                    <span
                        className="relative z-3 sm:px-3 py-1.5">
                        {
                            query.length > 0 ?
                                <XMarkIcon className="w-4 h-4 text-gray-400 hover:cursor-pointer" aria-hidden="true" onClick={resetQuery} /> :
                                <CiSearch className="w-4 h-4 text-gray-400" aria-hidden="true" />
                        }
                    </span>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="flex flex-col justify-center w-full lg:w-2/3 sm:flex-row text-sm xl:text-base">
                    <Button type="submit" className="sm:w-1/2 p-1 mb-2 sm:mb-0 sm:mr-4 bg-ward-blue text-white">
                        <div className="flex justify-center items-center">
                            <MdArrowOutward className="mr-1" />
                            <span>Analyze</span>
                        </div>
                    </Button>
                    <Button type="submit" className="sm:w-1/2 p-1 sm:ml-4 border ring-1 ring-ward-blue/50 bg-white text-ward-blue  dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600">
                        <div className="flex justify-center items-center">
                            <LuClover className="mr-1" />
                            <span>I'm Feeling Lucky</span>
                        </div>
                    </Button>
                </div>
            </div>
        </form>

    </>;
}

export default Searchbar;