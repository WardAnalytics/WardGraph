import { FC, useContext } from "react";
import { Transition } from "@headlessui/react";
import { HashtagIcon } from "@heroicons/react/20/solid";
import { ShareIcon } from "@heroicons/react/24/solid";

import { Address } from "../../../../../../api/galactus/model";
import formatNumber from "../../../../../../utils/formatNumber";

import BigButton from "../../../../../common/BigButton";
import { AnalysisContext } from "../../../AnalysisWindow";
import { GraphContext } from "../../../../Graph";
import { ExposureTabContext } from "./ExposureTabGeneric";

// Address Row _________________________________________________________________

interface AddressRowProps {
  address: Address;
}

/** This component is the address view.
 * It displays the focused address and its entities
 * It also allows to navigate to the transaction view of a specific address or analyze it
 *
 * @param address: the address to display
 */

const AddressRow: FC<AddressRowProps> = ({ address }) => {
  const { address: targetAddress } = useContext(AnalysisContext)!;
  const { focusedEntity } = useContext(ExposureTabContext)!;
  const { addAddressPaths } = useContext(GraphContext);

  function expand() {
    const paths: string[][] = address.paths
      ? address.paths
      : [[targetAddress, address.hash]];

    addAddressPaths(paths, focusedEntity!.incoming, address.quantity);
  }

  return (
    <li className="flex w-full items-center space-x-3" key={address.hash}>
      <div
        className="flex w-full cursor-pointer flex-row items-center justify-between rounded-md p-2 transition-all duration-100 hover:bg-gray-100"
        onClick={() => {
          expand();
        }}
      >
        <div className="flex items-center gap-x-2 text-xs text-gray-500">
          <HashtagIcon className="h-7 w-7 text-gray-300" />
          <span className="flex-col items-center space-y-1">
            <p className="font-mono text-sm font-semibold text-gray-800">
              {address.hash}
            </p>
            <p className="flex items-center gap-x-2 text-xs text-gray-500">
              {formatNumber(address.quantity)}
            </p>
          </span>
        </div>
        <BigButton text="Expand" Icon={ShareIcon} onClick={() => { }} />
      </div>
    </li>
  );
};

// Entity View _________________________________________________________________

const EntityView: FC = () => {
  const { focusedEntity } = useContext(ExposureTabContext)!;
  return (
    <div className="w-auto flex-grow flex-col space-y-2">
      {focusedEntity!.entity.addresses.map((address, index) => (
        <Transition
          appear={true}
          show={true}
          enter="transition-all ease-in-out transform duration-300 origin-left"
          enterFrom="-translate-x-10 -translate-y-3 opacity-0 scale-50"
          enterTo="translate-y-0 opacity-100 scale-100"
          leave="transition-all ease-in-out transform duration-300 origin-left"
          leaveFrom="translate-y-0 opacity-100 scale-100"
          leaveTo="-translate-x-10 -translate-y-3 opacity-0 scale-50"
          key={address.hash}
          style={{
            transitionDelay: `${index * (50 - index / 10)}ms`,
          }}
        >
          <AddressRow address={address} />
        </Transition>
      ))}
    </div>
  );
};

export default EntityView;
