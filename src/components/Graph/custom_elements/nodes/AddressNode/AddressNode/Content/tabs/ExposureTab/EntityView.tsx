import { Transition } from "@headlessui/react";
import { HashtagIcon } from "@heroicons/react/20/solid";
import { FC, useContext, useMemo, useState } from "react";

import { ShareIcon } from "@heroicons/react/24/solid";

import { Address } from "../../../../../../../../../api/model";
import formatNumber from "../../../../../../../../../utils/formatNumber";
import Delayed from "../../../../../../../../common/Delayed";

import BigButton from "../../../../../../../../common/BigButton";
import { GraphContext } from "../../../../../../../Graph";
import { AnalysisContext } from "../../../AddressNode";
import { ExposureTabContext } from "./ExposureTabGeneric";

import Pagination from "../../../../../../../../common/Pagination";

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

    addAddressPaths(paths, focusedEntity!.incoming);
  }

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
        <BigButton text="Expand" Icon={ShareIcon} onClick={expand} />
      </div>
    </li>
  );
};

// Entity View _________________________________________________________________

const EntityView: FC = () => {
  const { focusedEntity } = useContext(ExposureTabContext)!;

  const addresses = focusedEntity!.entity.addresses;

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return addresses.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, addresses]);

  return (
    <div className="w-auto flex-grow flex-col space-y-2">
      {currentTableData.map((address, index) => (
        <Delayed
          waitBeforeShow={currentPage === 1 ? index * (50 - index / 3) : 0}
          key={address.hash}
        >
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
      <Pagination
        currentPage={currentPage}
        totalCount={focusedEntity!.entity.addresses.length}
        pageSize={pageSize}
        onPageChange={(page: number) => setCurrentPage(page)}
      />
    </div>
  );
};

export default EntityView;
