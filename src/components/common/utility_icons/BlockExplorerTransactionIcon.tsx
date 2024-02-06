import { FC } from "react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

import { getTransactionLink } from "../../../utils/explorer_links";

interface BlockExplorerIconProps {
  blockchain: string;
  hash: string;
}

/** This component is an icon that links to the block explorer.
 * It uses the blockchain enum to get the block explorer URL for the blockchain.
 *
 * @param blockchain: The blockchain of the hash
 * @param hash: The hash to link to
 */

const BlockExplorerTransactionIcon: FC<BlockExplorerIconProps> = ({
  blockchain,
  hash,
}) => {
  // Get the block explorer hash link for the specific blockchain and hash
  const link = getTransactionLink(blockchain, hash);

  return (
    <a href={link} target="_blank" rel="noreferrer">
      <GlobeAltIcon
        className="transiotn-all h-5 w-5 text-gray-400 duration-200 hover:text-gray-500"
        aria-hidden="true"
      />
    </a>
  );
};

export default BlockExplorerTransactionIcon;
