import { FC, useContext } from "react";
import { Transition } from "@headlessui/react";
import { HashtagIcon } from "@heroicons/react/20/solid";

import { ArrowsUpDownIcon, ShareIcon } from "@heroicons/react/24/solid";

import { Address } from "../../../../../../api/model";
import formatNumber from "../../../../../../utils/number_conversion";

import Delayed from "../../../../../_common/component_utils/Delayed";

import { ButtonGroup, ButtonProps } from "../../../../component_utils/Button";
import { AnalysisContext } from "../../../AnalysisWindow";
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
  const { onExpandPaths, analysisData, transactionsEnabled, onExit } =
    useContext(AnalysisContext);
  const { setFocusedAddress, focusedEntity } = useContext(ExposureTabContext)!;

  let buttons: ButtonProps[] = [];

  if (transactionsEnabled)
    buttons.push({
      text: "Transactions",
      Icon: ArrowsUpDownIcon,
      onClick: () => {
        setFocusedAddress(address);
      },
    });

  if (onExpandPaths)
    buttons.push({
      text: "Expand",
      Icon: ShareIcon,
      onClick: () => {
        const paths: string[][] = address.paths
          ? address.paths
          : [[analysisData.address, address.hash]];

        onExit!();
        onExpandPaths(paths, focusedEntity!.incoming);
      },
    });

  return (
    <li className="flex w-full items-center space-x-3" key={address.hash}>
      <div className="flex w-full flex-row items-center justify-between rounded-md p-2 transition-all duration-100 hover:bg-gray-100">
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
        {buttons.length > 0 && <ButtonGroup buttons={buttons} />}
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
        <Delayed waitBeforeShow={index * (50 - index / 3)} key={address.hash}>
          <Transition
            appear={true}
            show={true}
            enter={`transition-all ease-in-out transform`}
            enterFrom="-translate-y-10 opacity-0"
            enterTo="translate-y-0 opacity-100"
            key={address.hash}
          >
            <AddressRow address={address} />
          </Transition>
        </Delayed>
      ))}
    </div>
  );
};

export default EntityView;
