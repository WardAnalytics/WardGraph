import Modal from "../common/Modal";

import { Transition } from "@headlessui/react";
import { ArrowUpRightIcon, BarsArrowDownIcon } from "@heroicons/react/16/solid";
import { FC, useEffect, useState } from "react";
import { Transaction } from "../../api/model";
import { useGetTransactionsBetweenAddresses } from "../../api/transactions/transactions";
import { Colors } from "../../utils/colors";
import formatNumber from "../../utils/formatNumber";
import Badge from "../common/Badge";
import EntityLogo from "../common/EntityLogo";
import "../common/Scrollbar.css";
import {
  BlockExplorerTransactionIcon,
  CopyToClipboardIcon,
} from "../common/utility_icons";

import { getTokenMetadata } from "../../api/transactions/transactions";
import { TokenMetadata } from "../../api/model/tokenMetadata";

interface TransactionRowProps {
  usdValue: number;
  timestamp: number;
  blockchain: string;
  hash: string;
  addresses: string[];
  currency: string;
}

const TransactionRow: FC<TransactionRowProps> = ({
  usdValue,
  blockchain,
  timestamp,
  addresses,
  currency,
  hash,
}) => {
  const date = new Date(timestamp * 1000);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const addressText: string =
    addresses.length === 1
      ? addresses[0].slice(0, 8) + "..." + addresses[0].slice(-8)
      : addresses.length + " addresses";

  return (
    <>
      <td className="text-left text-sm font-normal text-gray-900 group-hover:bg-gray-100 ">
        <span className="flex flex-row items-center gap-x-1">
          {formattedDate}
          <BlockExplorerTransactionIcon blockchain={blockchain} hash={hash} />
        </span>
      </td>
      <td className="text-left group-hover:bg-gray-100">
        <span className="flex flex-row items-center gap-x-1">
          <a className="font-mono text-sm font-normal text-gray-900">
            {addressText}
          </a>
          {addresses.length === 1 && (
            <CopyToClipboardIcon textToCopy={addresses[0]} />
          )}
          <Badge color={Colors.BLUE} Icon={ArrowUpRightIcon} text="OUT" />
        </span>
      </td>
      <td className="text-left text-sm font-normal text-gray-900 group-hover:bg-gray-100">
        <span className="flex flex-row items-center gap-x-1">
          <span>
            <EntityLogo entity={currency} className="h-6 w-6 rounded-full" />
          </span>
          <span>{formatNumber(usdValue)}</span>
          <span className="text-gray-500">{currency}</span>
        </span>
      </td>
    </>
  );
};

// Max transactions to fetch
const TRANSACTIONS_LIMIT = 200;

// Native tokens to not fetch from the API
const NATIVE_TOKENS = ["ETH", "BTC"];

interface TransactionsBetweenAddressesDialogProps {
  show: boolean;
  setShow: (show: boolean) => void;
  src: string;
  dst: string;
}

const TransactionsBetweenAddressesDialog: FC<
  TransactionsBetweenAddressesDialogProps
> = ({ show, setShow, src, dst }) => {
  // Total transaction and visible rows
  const [transactionRows, setTransactionRows] = useState<TransactionRowProps[]>(
    [],
  );

  const { refetch: getTransactions } = useGetTransactionsBetweenAddresses(
    {
      src,
      dst,
      page_size: TRANSACTIONS_LIMIT,
    },
    {
      query: {
        enabled: false,
        refetchOnWindowFocus: false,
        retry: true,
        cacheTime: 1000, // 1 second
        staleTime: 1000, // 1 second
        onSuccess: (data) => {
          const transactions: Transaction[] = data.transactions!;

          // Create token address to token ticker map where we'll store the token metadata
          const tokenAddressToTickerMap: Map<string, string> = new Map();

          // Get token metadata for each transaction's token (create a set of unique tokens)
          const tokens = new Set(
            transactions.map((transaction) => transaction.currency),
          );

          // Remove native tokens from the set and add them to the map
          NATIVE_TOKENS.forEach((token) => tokens.delete(token));
          NATIVE_TOKENS.forEach((token) =>
            tokenAddressToTickerMap.set(token, token),
          );

          // Get token metadata for each token
          getTokenMetadata({ addresses: Array.from(tokens) }).then(
            (response) => {
              response.metadatas!.forEach((metadata: TokenMetadata) => {
                console.log("metadata", metadata);
                tokenAddressToTickerMap.set(metadata.address, metadata.symbol);
              });

              const newTransactionRows: TransactionRowProps[] =
                transactions.map((transaction: Transaction) => {
                  const addresses: string[] = transaction.outputs.map(
                    (output) => output.address,
                  );

                  const ticker = tokenAddressToTickerMap.get(
                    transaction.currency,
                  );
                  // console.log("tokenAddressToTickerMap:", tokenAddressToTickerMap);
                  // console.log("ticker", ticker, transaction.currency);

                  // Go through each key in the map and log the key and value, and the comparison result
                  // tokenAddressToTickerMap.forEach((value, key) => {
                  //   console.log(
                  //     key,
                  //     value,
                  //     key === transaction.currency,
                  //     transaction.currency,
                  //   );
                  // });

                  return {
                    usdValue: transaction.usdValue,
                    timestamp: transaction.timestamp,
                    hash: transaction.hash,
                    addresses: addresses,
                    currency: ticker ? ticker : transaction.currency,
                    blockchain: "Ethereum",
                    expanded: false,
                  };
                });

              setTransactionRows(newTransactionRows);
            },
          );
        },
      },
    },
  );

  useEffect(() => {
    if (show) {
      getTransactions();
    } else {
      setTransactionRows([]);
    }
  }, [show]);

  return (
    <Modal isOpen={show} closeModal={() => setShow(false)} size="xl">
      <div className="flex h-full w-full flex-col gap-y-2">
        <h3 className="flex h-fit flex-row items-center gap-x-1 text-sm font-semibold tracking-wide text-gray-600">
          <BarsArrowDownIcon className="h-5 w-5 text-gray-400" />
          LATEST {TRANSACTIONS_LIMIT} CURRENCY TRANSACTIONS
        </h3>
        <div className="scrollbar flex flex-grow scroll-m-28 flex-col overflow-x-hidden overflow-y-scroll">
          <table className="h-fit min-w-full flex-col divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="text-left text-sm font-semibold text-gray-900"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="text-left text-sm font-semibold text-gray-900"
                >
                  Address
                </th>
                <th
                  scope="col"
                  className="text-left text-sm font-semibold text-gray-900"
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="h-fit divide-y divide-gray-200 bg-white">
              {transactionRows.map((transaction, index) => (
                <Transition
                  appear={true}
                  show={true}
                  as="tr"
                  enter="transition-all ease-in-out transform duration-300 origin-left"
                  enterFrom="-translate-x-10 -translate-y-3 opacity-0 scale-50"
                  enterTo="translate-y-0 opacity-100 scale-100"
                  leave="transition-all ease-in-out transform duration-300 origin-left"
                  leaveFrom="translate-y-0 opacity-100 scale-100"
                  leaveTo="-translate-x-10 -translate-y-3 opacity-0 scale-50"
                  style={{
                    transitionDelay: `${index * (50 - index / 5)}ms`,
                  }}
                  className="group mr-2 h-10 cursor-pointer"
                  key={transaction.hash + index}
                >
                  <TransactionRow key={transaction.hash} {...transaction} />
                </Transition>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionsBetweenAddressesDialog;
