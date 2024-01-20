import { SparklesIcon } from "@heroicons/react/20/solid";
import { FC } from "react";

import logo from "../../assets/ward-logo-blue-full.svg";
import Searchbar from "./SearchBar";

const PossibleAddresses: string[] = [
  "0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326",
  "0x388C818CA8B9251b393131C08a736A67ccB19297",
  "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
  "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
  "0xd24400ae8BfEBb18cA49Be86258a3C749cf46853"
]

interface LandingPageProps {
  setSearchedAddress: (address: string) => void
}

const LandingPage: FC<LandingPageProps> = ({ setSearchedAddress }) => {
  function selectRandomAddress() {
    const randomIndex = Math.floor(Math.random() * PossibleAddresses.length)
    setSearchedAddress(PossibleAddresses[randomIndex])
  }

  return (
    <>
      <div className="flex max-w-screen-sm flex-col items-center gap-y-10">
        <img src={logo} alt="Ward Logo" className="w-2/3" />
        <Searchbar className="w-2/3 sm:w-full" onSearchAddress={setSearchedAddress} />
        <h3
          className="flex cursor-pointer flex-row items-center gap-x-2 text-sm text-blue-500"
          onClick={selectRandomAddress}
        >
          <SparklesIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />
          I'm feeling lucky
        </h3>
      </div>
    </>
  )
}

export default LandingPage
