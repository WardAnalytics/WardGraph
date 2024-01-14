import { FC } from "react";
import { Transition } from "@headlessui/react";
import { SparklesIcon } from "@heroicons/react/20/solid";

interface LandingPageProps {
  setSearchedAddress: (address: string) => void;
}

const LandingPage: FC<LandingPageProps> = ({ setSearchedAddress }) => {
  return (
    <div className="flex h-screen flex-col justify-between overflow-hidden bg-main bg-cover bg-center bg-no-repeat">
      <div className="flex max-w-screen-sm flex-col items-center gap-y-10">
        <img src={logo} alt="Ward Logo" className="w-2/3" />
        <Searchbar className="w-full" onSearchAddress={setSearchedAddress} />
        <h3 className="flex flex-row items-center gap-x-2 text-sm text-blue-500">
          <SparklesIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />
          I'm feeling lucky
        </h3>
      </div>
    </div>
  );
};
