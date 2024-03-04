import Modal from "../common/Modal";

import { Transition } from "@headlessui/react";
import { ArrowUpRightIcon, BarsArrowDownIcon } from "@heroicons/react/16/solid";
import { FC, useEffect, useState } from "react";
import { GetTransactionsTransactionType, Transaction } from "../../api/model";
import { useGetTransactions } from "../../api/transactions/transactions";
import { Colors } from "../../utils/colors";
import formatNumber from "../../utils/formatNumber";
import Badge from "../common/Badge";
import EntityLogo from "../common/EntityLogo";
import "../common/Scrollbar.css";
import {
  BlockExplorerTransactionIcon,
  CopyToClipboardIcon,
} from "../common/utility_icons";

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
      <td className="text-left text-sm font-normal text-gray-900 ">
        <span className="flex flex-row items-center gap-x-1">
          {formattedDate}
          <BlockExplorerTransactionIcon blockchain={blockchain} hash={hash} />
        </span>
      </td>
      <td className="text-left ">
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
      <td className="text-left text-sm font-normal text-gray-900 ">
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

  const { refetch: getTransactions } = useGetTransactions(
    src,
    {
      destination_address: dst,
      page_size: TRANSACTIONS_LIMIT,
      transaction_type: GetTransactionsTransactionType.between,
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

          const newTransactionRows: TransactionRowProps[] = transactions.map(
            (transaction: Transaction) => {
              const addresses: string[] = transaction.outputs.map(
                (output) => output.address,
              );

              return {
                usdValue: transaction.usdValue,
                timestamp: transaction.timestamp,
                hash: transaction.hash,
                addresses: addresses,
                currency: transaction.tokenSymbol,
                blockchain: "Ethereum",
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
    if (show) {
      getTransactions();
    } else {
      setTransactionRows([]);
    }
  }, [show]);

  return (
    <Modal isOpen={show} closeModal={() => setShow(false)} size="fit">
      <div className="flex h-full w-[43rem] flex-col gap-y-2">
        <span className="flex flex-row items-center gap-1.5">
          <h3 className="flex h-fit flex-row items-center gap-x-1 text-sm font-semibold tracking-wide text-gray-600">
            <BarsArrowDownIcon className="h-5 w-5 text-gray-400" />
            LATEST {TRANSACTIONS_LIMIT} CURRENCY TRANSACTIONS
          </h3>
          <Badge
            color={Colors.BLUE}
            text={"From: " + src?.slice(0, 8) + "..."}
          />
          <Badge
            color={Colors.ORANGE}
            text={"To: " + dst?.slice(0, 8) + "..."}
          />
          <Badge color={Colors.GRAY} text={"USD Value > $0"} />
        </span>

        <div className="scrollbar mt-1 flex max-h-96 flex-grow scroll-m-28 flex-col overflow-x-hidden overflow-y-scroll">
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
                  className="mr-2 h-10"
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
