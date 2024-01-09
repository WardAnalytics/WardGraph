import { FC } from "react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

import { getAddressLink } from "../../../../../../../../utils/explorer_links";

interface BlockExplorerIconProps {
  blockchain: string;
  address: string;
}

/** This component is an icon that links to the block explorer.
 * It uses the blockchain enum to get the block explorer URL for the blockchain.
 *
 * @param blockchain: The blockchain of the address
 * @param address: The address to link to
 */

const BlockExplorerAddressIcon: FC<BlockExplorerIconProps> = ({
  blockchain,
  address,
}) => {
  // Get the block explorer address link for the specific blockchain and address
  const link = getAddressLink(blockchain, address);

  return (
    <a href={link} target="_blank" rel="noreferrer">
      <GlobeAltIcon
        className="transiotn-all h-5 w-5 text-gray-400 duration-200 hover:text-gray-500"
        aria-hidden="true"
      />
    </a>
  );
};

export default BlockExplorerAddressIcon;
