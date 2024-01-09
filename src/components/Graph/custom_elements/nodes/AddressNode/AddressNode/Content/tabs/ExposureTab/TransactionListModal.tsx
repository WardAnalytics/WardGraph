import { FC, Fragment, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  HashtagIcon,
  CubeIcon,
  ClockIcon,
  BanknotesIcon,
} from "@heroicons/react/20/solid";

import COLORS from "../../../../enums/colors";
import Badge from "../../../../visuals/badges/Badge";
import Tooltip from "../../../../component_utils/Tooltip";
import {
  BlockExplorerTransactionIcon,
  CopyToClipboardIcon,
} from "../../../../address_utils/";

import { AnalysisContext } from "../../../AnalysisWindow";

// All fetched transactions will get converted to this interface
export interface DisplayedTransaction {
  hash: string;
  block: number;
  age: string;
  date: Date;
  usdValue: number;
}

// List Header ________________________________________________________________

interface TransactionListHeaderProps {
  name: string;
  Icon: any;
}

/**
 * Displays a single transaction.
 *
 * @param name: the name of the header
 * @param Icon: the icon of the header
 */

const TransactionListHeader: FC<TransactionListHeaderProps> = ({
  name,
  Icon,
}: TransactionListHeaderProps) => {
  return (
    <th
      scope="col"
      className="table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
    >
      <Icon className="mr-1 inline-block h-4 w-4 text-gray-400" />
      {name}
    </th>
  );
};

// Transaction Row _____________________________________________________________

interface TransationRowProps {
  transaction: DisplayedTransaction;
}

/**
 * Displays a single transaction.
 *
 * @param transaction: the transaction to display
 */

const TransactionRow: FC<TransationRowProps> = ({
  transaction,
}: TransationRowProps) => {
  const blockchain = useContext(AnalysisContext).analysisData!.blockchain;

  return (
    <tr>
      <td className="flex w-fit flex-row py-4 pl-4 pr-3 text-sm text-gray-500">
        {transaction.hash.slice(0, 16) + "..."}
        <BlockExplorerTransactionIcon
          blockchain={blockchain}
          transactionHash={transaction.hash}
        />
        <CopyToClipboardIcon address={transaction.hash} />
      </td>
      <td className="px-3 py-4 text-sm text-gray-500">{transaction.block}</td>
      <td className="px-3 py-4 text-sm text-gray-500">
        <Tooltip message={transaction.date.toString()}>
          {transaction.age}
        </Tooltip>
      </td>

      <td className="px-3 py-4 text-sm text-gray-500">
        {/* Separate thousands with comma , */}$
        {transaction.usdValue.toLocaleString()}
      </td>
    </tr>
  );
};

// Transaction List ____________________________________________________________

interface TransactionListProps {
  transactions: DisplayedTransaction[];
}

/**
 * Displays a list of transactions between two addresses.
 *
 * @param transactions: the transactions to display
 */

const TransactionList: FC<TransactionListProps> = ({
  transactions,
}: TransactionListProps) => {
  return (
    <div className="">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <TransactionListHeader name="Transaction Hash" Icon={HashtagIcon} />
            <TransactionListHeader name="Block" Icon={CubeIcon} />
            <TransactionListHeader name="Age" Icon={ClockIcon} />
            <TransactionListHeader name="Value" Icon={BanknotesIcon} />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {transactions.map((txn) => (
            <TransactionRow key={txn.hash} transaction={txn} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Transation List Modal _______________________________________________________

interface TransactionListModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  srcAddress: string;
  dstAddress: string;
  transactions: DisplayedTransaction[];
}

/**
 * Displays a list of transactions between two addresses.
 *
 * @param isOpen: whether or not the modal is open
 * @param setIsOpen: function to set the modal open state
 * @param srcAddress: the source address
 * @param dstAddress: the destination address
 * @param transactions: the transactions to display
 */

const TransactionListModal: FC<TransactionListModalProps> = ({
  isOpen,
  setIsOpen,
  srcAddress,
  dstAddress,
  transactions,
}: TransactionListModalProps) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex max-w-4xl transform flex-col space-y-3 rounded-xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Transaction List
                    <div className="mt-2 flex flex-row flex-wrap gap-x-2 gap-y-2">
                      <Badge color={COLORS.Gray} text={`USD Value > $0`} />
                      <Badge
                        color={COLORS.Gray}
                        text={`From - ${srcAddress}`}
                      />
                      <Badge color={COLORS.Gray} text={`To - ${dstAddress}`} />
                    </div>
                  </Dialog.Title>
                  <TransactionList transactions={transactions} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default TransactionListModal;
