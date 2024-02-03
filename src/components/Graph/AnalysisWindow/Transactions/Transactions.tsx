import { Transition } from "@headlessui/react";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  BarsArrowDownIcon,
} from "@heroicons/react/16/solid";
import {
  FC,
  useContext
} from "react";


import { Colors } from "../../../../utils/colors";
import formatNumber from "../../../../utils/formatNumber";

import Badge from "../../../common/Badge";

import { GraphContext } from "../../Graph";

import CopyToClipboardIcon from "../Header/components/CopyToClipboardIcon";

import "../Scrollbar.css";

interface TransactionRowProps {
  hash: string;
  usdValue: number;
  timestamp: number;
  address: string;
  incoming: boolean;
  currency: string;
}

const placeholderTransactions: TransactionRowProps[] = [
  {
    hash: "0x0",
    usdValue: 20.5,
    address: "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
    timestamp: 1627584000,
    incoming: true,
    currency: "ETH",
  },
  {
    hash: "0x1",
    usdValue: 50.71,
    address: "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
    timestamp: 1627585000,
    incoming: true,
    currency: "MATIC",
  },
  {
    hash: "0x2",
    usdValue: 100.0,
    address: "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
    timestamp: 1627586000,
    incoming: true,
    currency: "BTC",
  },
  {
    hash: "0x3",
    usdValue: 500.0,
    address: "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
    timestamp: 1627587000,
    incoming: false,
    currency: "ETH",
  },
  {
    hash: "0x4",
    usdValue: 1000.0,
    address: "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
    timestamp: 1627588000,
    incoming: true,
    currency: "BTC",
  },
  {
    hash: "0x5",
    usdValue: 2000.0,
    address: "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
    timestamp: 1627589000,
    incoming: false,
    currency: "MATIC",
  },
  {
    hash: "0x6",
    usdValue: 5000.0,
    address: "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
    timestamp: 1627590000,
    incoming: true,
    currency: "ETH",
  },
  {
    hash: "0x7",
    usdValue: 10000.0,
    address: "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
    timestamp: 1627591000,
    incoming: true,
    currency: "BTC",
  },
  {
    hash: "0x8",
    usdValue: 20000.0,
    address: "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
    timestamp: 1627592000,
    incoming: true,
    currency: "MATIC",
  },
  {
    hash: "0x9",
    usdValue: 50000.0,
    address: "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
    timestamp: 1627593000,
    incoming: false,
    currency: "ETH",
  },
  {
    hash: "0x10",
    usdValue: 100000.0,
    address: "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
    timestamp: 1627594000,
    incoming: false,
    currency: "BTC",
  },
  {
    hash: "0x11",
    usdValue: 200000.0,
    address: "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
    timestamp: 1627595000,
    incoming: false,
    currency: "MATIC",
  },
  {
    hash: "0x12",
    usdValue: 500000.0,
    address: "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
    timestamp: 1627596000,
    incoming: true,
    currency: "ETH",
  },
  {
    hash: "0x13",
    usdValue: 1000000.0,
    timestamp: 1627597000,
    incoming: false,
    address: "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
    currency: "BTC",
  },
];

/*

<Badge
        color={incoming ? Colors.BLUE : Colors.ORANGE}
        Icon={incoming ? ArrowDownLeftIcon : ArrowUpRightIcon}
        text={incoming ? "IN" : "OUT"}
      />
*/

const TransactionRow: FC<TransactionRowProps> = ({
  usdValue,
  timestamp,
  incoming,
  address,
  currency,
}) => {
  const date = new Date(timestamp * 1000);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <td className="px-3 py-3.5 text-left text-sm font-normal text-gray-900 sm:pl-0">
        {formattedDate}
      </td>
      <td className="flex flex-row gap-x-1.5 px-3 py-3.5 text-left">
        <a className="font-mono text-sm font-normal text-gray-900">
          {address.slice(0, 8) + "..." + address.slice(-8)}
        </a>
        <CopyToClipboardIcon textToCopy={address} />
        <Badge
          color={incoming ? Colors.BLUE : Colors.ORANGE}
          Icon={incoming ? ArrowDownLeftIcon : ArrowUpRightIcon}
          text={incoming ? "IN" : "OUT"}
        />
      </td>
      <td className="px-3 py-3.5 text-left text-sm font-normal text-gray-900">
        <span className="flex flex-row items-center gap-x-1">
          <span>{formatNumber(usdValue)}</span>
          <span className="text-gray-500">{currency}</span>
        </span>
      </td>
    </>
  );
};

const Transactions: FC = () => {
  const focusedAddressData = useContext(GraphContext).focusedAddressData!;

  // TODO - Add a max height and a scrollbar, maybe a slight fade effect to the bottom and top
  return (
    <div className="flex h-full w-full flex-col gap-y-2">
      <h3 className="flex h-fit flex-row items-center gap-x-1 text-sm font-semibold tracking-wide text-gray-600">
        <BarsArrowDownIcon className="h-5 w-5 text-gray-400" />
        LATEST 500 TRANSACTIONS
      </h3>
      <div className="scrollbar flex flex-grow scroll-m-28 overflow-scroll overflow-x-hidden">
        <table className="min-w-full flex-col divide-y divide-gray-300 ">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                Date
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Address
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {placeholderTransactions.map((transaction, index) => (
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
                className="mr-2"
                style={{
                  transitionDelay: `${index * (100 - index / 10)}ms`,
                }}
                key={transaction.hash + focusedAddressData.address}
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
