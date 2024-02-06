import { FC, useState, useContext, useEffect } from "react";
import {
  BarsArrowDownIcon,
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  PlusIcon,
  CheckIcon,
} from "@heroicons/react/16/solid";
import { Transition } from "@headlessui/react";

import { Transaction, Output } from "../../../../../api/model";
import { useGetCombinedTransactions } from "../../../../../api/transactions/transactions";

import { Colors } from "../../../../../utils/colors";
import formatNumber from "../../../../../utils/formatNumber";

import Badge from "../../../../common/Badge";
import {
  CopyToClipboardIcon,
  BlockExplorerTransactionIcon,
} from "../../../../common/utility_icons";

import { GraphContext } from "../../../Graph";
import "../../../../common/Scrollbar.css";

interface TransactionRowProps {
  usdValue: number;
  timestamp: number;
  incoming: boolean;
  blockchain: string;
  hash: string;
  addresses: string[];
  currency: string;
  expanded: boolean;
}

const TransactionRow: FC<TransactionRowProps> = ({
  usdValue,
  blockchain,
  timestamp,
  incoming,
  addresses,
  currency,
  hash,
  expanded,
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
          <Badge
            color={incoming ? Colors.BLUE : Colors.ORANGE}
            Icon={incoming ? ArrowDownLeftIcon : ArrowUpRightIcon}
            text={incoming ? "IN" : "OUT"}
          />
        </span>
      </td>
      <td className="text-left text-sm font-normal text-gray-900 group-hover:bg-gray-100">
        <span className="flex flex-row items-center gap-x-1">
          <span>{formatNumber(usdValue)}</span>
          <span className="text-gray-500">{currency}</span>
        </span>
      </td>
      <td className="relative w-1 pr-5 group-hover:bg-gray-100">
        {expanded ? (
          <span className="flex flex-row items-center gap-x-1 font-normal text-gray-300">
            Expanded
            <CheckIcon className="h-4 w-4" />
          </span>
        ) : (
          <span className="flex flex-row items-center gap-x-1 font-semibold text-blue-500 group-hover:underline">
            Expand
            <PlusIcon className="h-4 w-4" />
          </span>
        )}
      </td>
    </>
  );
};

const TRANSACTIONS_LIMIT = 50;

const Transactions: FC = () => {
  const focusedAddressData = useContext(GraphContext).focusedAddressData!;
  const addAddressPaths = useContext(GraphContext).addAddressPaths;

  const [transactionRows, setTransactionRows] = useState<TransactionRowProps[]>(
    [],
  );

  const { refetch: getAddressData } = useGetCombinedTransactions(
    {
      address: focusedAddressData.address,
      count: TRANSACTIONS_LIMIT,
    },
    {
      query: {
        enabled: false,
        refetchOnWindowFocus: false,
        retry: true,

        cacheTime: 1000, // 1 second
        staleTime: 1000, // 1 second

        onSuccess: (data) => {
          // Only get the first TRANSACTIONS_LIMIT transactions
          const transactions: Transaction[] = data.transactions!.slice(
            0,
            TRANSACTIONS_LIMIT,
          );

          const newTransactionRows: TransactionRowProps[] = transactions.map(
            (transaction: Transaction) => {
              const incoming = transaction.outputs.some(
                (output: Output) =>
                  output.address === focusedAddressData.address,
              );

              const addresses: string[] = incoming
                ? transaction.inputs.map((input) => input.address)
                : transaction.outputs.map((output) => output.address);

              return {
                usdValue: transaction.usdValue,
                timestamp: transaction.timestamp,
                incoming: incoming,
                hash: transaction.hash,
                addresses: addresses,
                currency: transaction.currency,
                blockchain: focusedAddressData.blockchain,
                expanded: false,
              };
            },
          );

          setTransactionRows(newTransactionRows);
        },
      },
    },
  );

  useEffect(() => {
    setTransactionRows([]);
    getAddressData();
  }, [focusedAddressData.address]);

  // TODO - Add a max height and a scrollbar, maybe a slight fade effect to the bottom and top
  return (
    <div className="flex h-full w-full flex-col gap-y-2">
      <h3 className="flex h-fit flex-row items-center gap-x-1 text-sm font-semibold tracking-wide text-gray-600">
        <BarsArrowDownIcon className="h-5 w-5 text-gray-400" />
        LATEST {TRANSACTIONS_LIMIT} CURRENCY TRANSACTIONS
      </h3>
      <div className="scrollbar flex flex-grow scroll-m-28 overflow-scroll overflow-x-hidden">
        <table className="min-w-full flex-col divide-y divide-gray-300 ">
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
              <th scope="col" className="relative w-1"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
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
                key={transaction.hash + focusedAddressData.address}
                onClick={() => {
                  const paths: string[][] = transaction.addresses.map(
                    (address) => {
                      return [focusedAddressData.address, address];
                    },
                  );

                  addAddressPaths(
                    paths,
                    transaction.incoming,
                    transaction.usdValue,
                  );

                  const newTransactionRows = transactionRows.map(
                    (row: TransactionRowProps) => {
                      if (row.hash === transaction.hash) {
                        return {
                          ...row,
                          expanded: true,
                        };
                      } else {
                        return row;
                      }
                    },
                  );
                  setTransactionRows(newTransactionRows);
                }}
              >
                <TransactionRow key={transaction.hash} {...transaction} />
              </Transition>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
