import Blockchain from "../blockchain_enum";

function getAddressLink(blockchain: string, address: string): string {
  switch (blockchain) {
    case Blockchain.BITCOIN:
      return `https://www.blockchain.com/btc/address/${address}`;
    case Blockchain.ETHEREUM:
      return `https://etherscan.io/address/${address}`;
    default:
      console.error(
        `No block explorer link has been set for blockchain ${blockchain}`,
      );
      return "";
  }
}

export default getAddressLink;
