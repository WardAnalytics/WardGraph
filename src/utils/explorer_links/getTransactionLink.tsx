import Blockchain from "../blockchain_enum";

function getTransactionLink(blockchain: string, hash: string): string {
  switch (blockchain) {
    case Blockchain.BITCOIN:
      return `https://www.blockchain.com/explorer/transactions/btc/${hash}`;
    case Blockchain.ETHEREUM:
      return `https://etherscan.io/tx/${hash}`;
    default:
      console.error(
        `No block explorer link has been set for blockchain ${blockchain}`,
      );
      return "";
  }
}

export default getTransactionLink;
