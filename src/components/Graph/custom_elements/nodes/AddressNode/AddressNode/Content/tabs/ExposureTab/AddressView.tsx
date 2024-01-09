import { FC, useState, useEffect, useContext } from "react";
import { Transition } from "@headlessui/react";
import {
  FingerPrintIcon,
  HashtagIcon,
  MagnifyingGlassIcon,
  ChevronDoubleUpIcon,
  ChevronDoubleDownIcon,
} from "@heroicons/react/20/solid";

import { useGetTransactionsBetweenAddresses } from "../../../../../../api/transactions/transactions";
import { Transaction } from "../../../../../../api/model";

import LabelList from "../../../../visuals/badges/LabelList";
import {
  BlockExplorerAddressIcon,
  CopyToClipboardIcon,
  AnalyzeAddressIcon,
} from "../../../../address_utils";
import LoadingCircle from "../../../../visuals/loading/LoadingCircle";

import TransactionListModal, {
  DisplayedTransaction,
} from "./TransactionListModal";

import { AnalysisContext } from "../../../AnalysisWindow";

// Multiple Paths Info ________________________________________________________

import { InformationCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

interface PathButtonProps {
  index: number;
  setPath: (path: number) => void;
  isSelected: boolean;
}

/** Button for a path in the multiple paths info component
 *
 * @param path: The path to display
 * @param setPath: The function to set the path in the parent component
 */

const PathButton: FC<PathButtonProps> = ({ index, setPath, isSelected }) => {
  // If selected, add bg-blue-100. Else, add bg-blue-50
  const bg = isSelected ? "bg-blue-100" : "bg-blue-50";

  return (
    <button
      type="button"
      onClick={() => setPath(index)}
      className={clsx(
        "inline-flex items-center gap-x-1 rounded-md px-3 py-1.5 text-xs font-semibold text-blue-900 shadow-sm outline-blue-500 ring-1 ring-inset ring-blue-300 transition-all duration-100 hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        bg,
      )}
    >
      {"Path " + (index + 1)}
    </button>
  );
};

interface MultiplePathsInfoProps {
  paths: string[][];
  setPath: (path: number) => void;
  selectedPath: number;
}

const MultiplePathsInfo: FC<MultiplePathsInfoProps> = ({
  paths,
  setPath,
  selectedPath,
}) => {
  return (
    <div className="m-4 flex flex-col space-y-3 rounded-md bg-blue-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className="h-5 w-5 text-blue-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-blue-700">
            There exist multiple paths to the same address. Inspect more paths
            to reveal new information.
          </p>
        </div>
      </div>
      <ul className="flex flex-row flex-wrap gap-x-2 gap-y-2">
        {paths.map((_, index) => {
          return (
            <li>
              <PathButton
                setPath={setPath}
                index={index}
                isSelected={selectedPath === index}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Transactions Button _______________________________________________________

interface TransactionButtonProps {
  upstream: boolean;
  srcAddress: string;
  dstAddress: string;
}

/** Upstream/Downstream button in the feed
 *
 * @param upstream: Whether the button is for upstream or downstream transactions
 * @param srcAddress: The source address
 * @param dstAddress: The destination address
 * @param blockchain: The blockchain
 */

const TransactionsButton: FC<TransactionButtonProps> = ({
  upstream,
  srcAddress,
  dstAddress,
}) => {
  // Whether or not the popup is open
  const [isOpen, setIsOpen] = useState(false);

  // Transactions between the two addresses
  const [transactions, setTransactions] = useState<DisplayedTransaction[]>([]);

  /** Calculates the age of the transaction and returns a string.
   * Example: "2 days ago" or "1 year ago"
   *
   * @param timestamp: The timestamp of the transaction UNIX
   * @returns calculated age of the transaction
   */

  function CalculateAge(timestamp: number): string {
    // Calculated age should show up as "2 days ago" or "1 year ago". This should apply for seconds, minutes, hours, days, weeks, months, and years.
    const now = new Date();
    const txnDate = new Date(timestamp * 1000);
    const difference = now.getTime() - txnDate.getTime();

    // Now, based on how big the difference is, decide whether to show seconds, minutes, hours, days, weeks, months, or years
    let calculatedAge = "";
    if (difference < 1000 * 60) {
      calculatedAge = Math.floor(difference / 1000) + " seconds ago";
    } else if (difference < 1000 * 60 * 60) {
      calculatedAge = Math.floor(difference / (1000 * 60)) + " minutes ago";
    } else if (difference < 1000 * 60 * 60 * 24) {
      calculatedAge = Math.floor(difference / (1000 * 60 * 60)) + " hours ago";
    } else if (difference < 1000 * 60 * 60 * 24 * 7) {
      calculatedAge =
        Math.floor(difference / (1000 * 60 * 60 * 24)) + " days ago";
    } else if (difference < 1000 * 60 * 60 * 24 * 7 * 4) {
      calculatedAge =
        Math.floor(difference / (1000 * 60 * 60 * 24 * 7)) + " weeks ago";
    } else if (difference < 1000 * 60 * 60 * 24 * 7 * 4 * 12) {
      calculatedAge =
        Math.floor(difference / (1000 * 60 * 60 * 24 * 7 * 4)) + " months ago";
    } else {
      calculatedAge =
        Math.floor(difference / (1000 * 60 * 60 * 24 * 7 * 4 * 12)) +
        " years ago";
    }

    return calculatedAge;
  }

  /** Converts the transactions from the API into the DisplayedTransaction interface
   * so that it can be easily displayed in the table.
   *
   * @param transactions
   * @returns displayed transactions
   */

  function ConvertTransactions(
    transactions: Transaction[],
  ): DisplayedTransaction[] {
    const displayedTransactions: DisplayedTransaction[] = [];

    for (const txn of transactions) {
      let usdValue = 0;
      for (const output of txn.outputs) {
        if (output.address === dstAddress) {
          usdValue += output.usdValue;
        }
      }

      const displayedTxn: DisplayedTransaction = {
        hash: txn.hash,
        block: txn.blockNumber,
        age: CalculateAge(txn.timestamp),
        date: new Date(txn.timestamp * 1000),
        usdValue: usdValue,
      };

      displayedTransactions.push(displayedTxn);
    }

    return displayedTransactions;
  }

  // Fetch transactions from the API
  const { isLoading: isLoading, refetch: getTransactions } =
    useGetTransactionsBetweenAddresses(
      {
        src: srcAddress,
        dst: dstAddress,
      },
      {
        query: {
          enabled: false,
          refetchOnWindowFocus: false,

          cacheTime: 1000, // 1 second
          staleTime: 1000, // 1 second

          onSuccess: (data) => {
            const txns = ConvertTransactions(data.transactions);
            setTransactions(txns);
          },
        },
      },
    );

  // Refetch transactiosn whenever the src or dst address changes. Transform them into the DisplayedTransaction interface
  useEffect(() => {
    if (srcAddress && dstAddress) {
      setTransactions([]);
      getTransactions();
    }
  }, [srcAddress, dstAddress]);

  // Pick the icon and text depending on whether it's upstream or downstream
  const icon = upstream ? (
    <ChevronDoubleUpIcon
      className="h-4 w-4 rounded-full  text-gray-400"
      aria-hidden="true"
    />
  ) : (
    <ChevronDoubleDownIcon
      className="h-4 w-4 rounded-full  text-gray-400"
      aria-hidden="true"
    />
  );

  if (isLoading) {
    return (
      <div className="-ml-[0.9rem] px-2 py-1.5">
        <LoadingCircle />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="-ml-[0.9rem] inline-flex items-center gap-x-1 rounded-md bg-gray-50 py-1.5 pl-2 pr-4 text-xs font-semibold text-gray-400 ring-1 ring-inset ring-gray-300 ">
        {icon}0 {upstream ? "Upstream" : "Downstream"} Transactions
      </div>
    );
  }

  return (
    <Transition
      appear={true}
      show={true}
      enter={`transition-all ease-in-out transform`}
      enterFrom="-translate-x-20 opacity-50"
      enterTo="translate-y-0 opacity-100"
    >
      <>
        <button
          className="-ml-[0.9rem] inline-flex items-center gap-x-1 rounded-md bg-white px-2 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
          onClick={() => setIsOpen(true)}
        >
          {icon}{" "}
          {`${transactions.length} ${
            upstream ? "Upstream" : "Downstream"
          } Transaction${transactions.length === 1 ? "" : "s"}`}
        </button>
        <TransactionListModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          srcAddress={srcAddress}
          dstAddress={dstAddress}
          transactions={transactions}
        />
      </>
    </Transition>
  );
};

// Connecting Line ___________________________________________________________

/** Connecting line between two addresses in the feed
 */

const ConnectingLine = () => {
  return <div className="h-5 w-[0.1rem] bg-gray-200" aria-hidden="true" />;
};

// Feed Row _________________________________________________________________

interface FeedRowProps {
  address: string;
  nextAddress: string | null;
  isFirst: boolean;
  labels: string[];
}

/** Row for the feed of transactions between elements.
 *  Can be expanded to list the first N transactions between address and nextAddress.
 *
 *
 * @param address: Current address hash
 * @param nextAddress: What the next address after this element is
 * @param isFirst: Whether or not this element is the first row of the list
 * @param labels: The labels of the current address
 */

const FeedRow: FC<FeedRowProps> = ({
  address,
  nextAddress,
  isFirst,
  labels,
}) => {
  const { onSearch, analysisData } = useContext(AnalysisContext)!;
  const blockchain = analysisData.blockchain;

  // Switch colors, icon, and marker depending on whether it's the first address, the last address, or an intermediate address
  let marker = "";
  let symbol = null;

  if (isFirst) {
    marker = "Current";
    symbol = (
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 ring-1 ring-blue-700/10">
        <MagnifyingGlassIcon
          className="h-5 w-5 text-blue-600"
          aria-hidden="true"
        />
      </span>
    );
  } else if (nextAddress === null) {
    marker = "Exposed";
    symbol = (
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 ring-1 ring-orange-600/10">
        <FingerPrintIcon
          className="h-5 w-5 text-orange-500"
          aria-hidden="true"
        />
      </span>
    );
  } else {
    marker = "Intermediate";
    symbol = (
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-500/10">
        <HashtagIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </span>
    );
  }

  return (
    <div className="relative mt-1 flex flex-col items-start justify-start gap-y-2">
      <div className="relative flex flex-row items-center gap-x-3">
        {/* Symbol for current icon */}
        {symbol}

        {/* Address information */}
        <div className="flex w-96 flex-1 justify-between space-x-4 pt-1.5">
          <div className="flex flex-row gap-x-2">
            <div className="flex-col space-y-0.5">
              <span className="flex items-center space-x-1.5">
                {/* Address hash lg */}
                <span className="hidden lg:block">
                  <p className="font-mono text-sm font-semibold text-gray-800">
                    {address}
                  </p>
                </span>

                {/* Address hash sm */}
                <p className="text-sm font-semibold text-gray-800 lg:hidden">
                  {address.slice(0, 10) +
                    "..." +
                    address.slice(address.length - 10, address.length)}
                </p>

                {/* Copy and search icons */}
                <CopyToClipboardIcon address={address} />
                <BlockExplorerAddressIcon
                  address={address}
                  blockchain={blockchain}
                />
                {isFirst !== null && onSearch && (
                  <AnalyzeAddressIcon
                    address={address}
                    setTargetAddress={onSearch}
                  />
                )}
              </span>
              <span className="flex gap-x-1.5">
                <p className="flex items-center gap-x-2 text-xs text-gray-500">
                  {marker}
                </p>
                <span className="lg:hidden">
                  <LabelList labels={labels} />
                </span>
              </span>
            </div>
            <span className="hidden lg:block">
              <LabelList labels={labels} />
            </span>
          </div>
        </div>
      </div>

      {
        /* If it's not the first address, display the buttons for showing the upstream and downstream transactions */
        nextAddress === null ? null : (
          <div className="ml-5 flex flex-col gap-y-1">
            <ConnectingLine />
            {/* Upstream Transactions Button */}
            <TransactionsButton
              upstream={true}
              srcAddress={address}
              dstAddress={nextAddress!}
            />
            <ConnectingLine />
            {/* Downstream Transactions Button */}
            <TransactionsButton
              upstream={false}
              srcAddress={nextAddress!}
              dstAddress={address}
            />
            <ConnectingLine />
          </div>
        )
      }
    </div>
  );
};

// Feed ______________________________________________________________________

interface FeedProps {
  path: string[];
}

/** The feed is a path of addresses with transactiosn going from one to another.
 * It produces a list of FeedRows.
 *
 * @param path: The list of addresses going from the focusedAddress to the targetAddress
 */

const Feed: FC<FeedProps> = ({ path }) => {
  const labelsMap = new Map<string, string[]>();

  return (
    <ul role="list" className="m-4">
      {path.map((address, index) => {
        const nextAddress = index === path.length - 1 ? null : path[index + 1];
        const labels = labelsMap.get(address) ?? [];

        return (
          <li key={address}>
            <FeedRow
              address={address}
              nextAddress={nextAddress}
              labels={labels}
              isFirst={index === 0}
            />
          </li>
        );
      })}
    </ul>
  );
};

// Address View ______________________________________________________________

interface AddressViewProps {
  paths: string[][];
}

/** The address view is a feed of addresses sending transactions to the target address.
 *  Between two addresses, there exists a button to expand and inspect the list of transactions
 * between the two addresses.
 *
 * @params path: The list of addresses going from the focusedAddress to the targetAddress
 */

const AddressView: FC<AddressViewProps> = ({ paths }) => {
  // Use state for current path
  const [currentPath, setCurrentPath] = useState(paths[0]);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);

  // Whenever current path index changes, update current path
  useEffect(() => {
    setCurrentPath(paths[currentPathIndex]);
  }, [currentPathIndex]);

  return (
    <div className="w-auto flex-grow flex-col space-y-5">
      <Transition
        appear={true}
        show={true}
        enter={`transition-all ease-in-out transform`}
        enterFrom="-translate-y-10 opacity-0"
        enterTo="translate-y-0 opacity-100"
      >
        {paths.length > 1 ? (
          <MultiplePathsInfo
            setPath={setCurrentPathIndex}
            paths={paths}
            selectedPath={currentPathIndex}
          />
        ) : null}
        <Feed path={currentPath} />
      </Transition>
    </div>
  );
};

export default AddressView;
