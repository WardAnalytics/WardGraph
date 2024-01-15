import { SparklesIcon } from "@heroicons/react/20/solid";
import { FC } from "react";

import logo from "../../../assets/ward-logo-blue-full.svg";
import Searchbar from "./SearchBar";

const PossibleAddresses: string[] = [
  "0x19aa5fe80d33a56d56c78e82ea5e50e5d80b4dff",
  "0x74487eed1e67f4787e8c0570e8d5d168a05254d4",
  "0xd1381f89b4feea63e9c6bc97dc9fc2b0c96bf12f",
  "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be",
  "0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc",
];

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
