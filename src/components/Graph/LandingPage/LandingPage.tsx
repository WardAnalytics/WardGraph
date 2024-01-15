import { SparklesIcon } from "@heroicons/react/20/solid";
import { FC } from "react";

import logo from "../../../assets/ward-logo-blue-full.svg";
import Searchbar from "./SearchBar";

// TODO - Fill this with real juicy addressess
const PossibleAddresses: string[] = [];

interface LandingPageProps {
  setSearchedAddress: (address: string) => void;
}

const LandingPage: FC<LandingPageProps> = ({ setSearchedAddress }) => {
  function selectRandomAddress() {
    const randomIndex = Math.floor(Math.random() * PossibleAddresses.length);
    setSearchedAddress(PossibleAddresses[randomIndex]);
  }

  return (
    <div className="flex max-w-screen-sm flex-col items-center gap-y-10">
      <img src={logo} alt="Ward Logo" className="w-2/3" />
      <Searchbar className="w-full" onSearchAddress={setSearchedAddress} />
      <h3
        className="flex cursor-pointer flex-row items-center gap-x-2 text-sm text-blue-500"
        onClick={selectRandomAddress}
      >
        <SparklesIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />
        I'm feeling lucky
      </h3>
    </div>
  );
};

export default LandingPage;
