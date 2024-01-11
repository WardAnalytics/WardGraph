import {
  NoSymbolIcon,
  CreditCardIcon,
  CpuChipIcon,
  LockClosedIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  ArrowPathRoundedSquareIcon,
  CubeIcon,
  ArrowsPointingInIcon,
  ArrowTopRightOnSquareIcon,
  BoltIcon,
  WalletIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon,
  PhotoIcon,
  ShoppingCartIcon,
  CloudIcon,
  EyeDropperIcon,
  BanknotesIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import Category from "./enum";

type CategoryClass = {
  risk: number;
  icon: React.FC;
};

const CategoryClasses: Record<string, CategoryClass> = {
  [Category.GOVERNMENT_CRIMINAL_BLACKLIST]: {
    risk: 10,
    icon: NoSymbolIcon,
  },
  [Category.DARKNET_MARKET]: {
    risk: 10,
    icon: NoSymbolIcon,
  },
  [Category.DARK_MARKET]: {
    risk: 10,
    icon: NoSymbolIcon,
  },
  [Category.DARKNET]: {
    risk: 10,
    icon: NoSymbolIcon,
  },
  [Category.PHISHING_HACKING]: {
    risk: 7.5,
    icon: CpuChipIcon,
  },
  [Category.RANSOMWARE]: {
    risk: 7.5,
    icon: LockClosedIcon,
  },
  [Category.MONEY_LAUNDERING]: {
    risk: 7.5,
    icon: CurrencyDollarIcon,
  },
  [Category.BLACKMAIL]: {
    risk: 7.5,
    icon: EnvelopeIcon,
  },
  [Category.SCAM]: {
    risk: 7.5,
    icon: ExclamationCircleIcon,
  },
  [Category.TUMBLER]: {
    risk: 7.5,
    icon: ArrowPathRoundedSquareIcon,
  },
  [Category.MIXER]: {
    risk: 7.5,
    icon: ArrowPathRoundedSquareIcon,
  },
  [Category.PARITY_BUG]: {
    risk: 7.5,
    icon: ExclamationCircleIcon,
  },
  [Category.PONZI_SCHEME]: {
    risk: 7.5,
    icon: CurrencyDollarIcon,
  },
  [Category.BLOCKED]: {
    risk: 5,
    icon: NoSymbolIcon,
  },
  [Category.GAMBLING]: {
    risk: 5,
    icon: CubeIcon,
  },
  [Category.DEFI]: {
    risk: 5,
    icon: ArrowsPointingInIcon,
  },
  [Category.DEX]: {
    risk: 5,
    icon: ArrowsPointingInIcon,
  },
  [Category.BRIDGE]: {
    risk: 5,
    icon: ArrowTopRightOnSquareIcon,
  },
  [Category.MEV_BOT]: {
    risk: 5,
    icon: BoltIcon,
  },
  [Category.P2P_FINANCIAL_INFRASTRUCTURE_SERVICE]: {
    risk: 2.5,
    icon: ArrowsPointingInIcon,
  },
  [Category.P2P_FINANCIAL_SERVICE]: {
    risk: 2.5,
    icon: ArrowsPointingInIcon,
  },
  [Category.WALLET]: {
    risk: 2.5,
    icon: WalletIcon,
  },
  [Category.CUSTODIAL_WALLET]: {
    risk: 1,
    icon: WalletIcon,
  },
  [Category.CENTRALIZED_EXCHANGE]: {
    risk: 1,
    icon: BuildingLibraryIcon,
  },
  [Category.CYBER_SECURITY_SERVICE]: {
    risk: 1,
    icon: ShieldCheckIcon,
  },
  [Category.EXCHANGE]: {
    risk: 1,
    icon: BuildingLibraryIcon,
  },
  [Category.NFT_MARKETPLACE]: {
    risk: 1,
    icon: PhotoIcon,
  },
  [Category.MARKETPLACE]: {
    risk: 1,
    icon: ShoppingCartIcon,
  },
  [Category.CLOUD_MINING]: {
    risk: 1,
    icon: CloudIcon,
  },
  [Category.FAUCET]: {
    risk: 1,
    icon: EyeDropperIcon,
  },
  [Category.PAYMENT_PROCESSOR]: {
    risk: 1,
    icon: CreditCardIcon,
  },
  [Category.MINING_POOL]: {
    risk: 1,
    icon: CubeIcon,
  },
  [Category.E_COMMERCE]: {
    risk: 1,
    icon: ShoppingCartIcon,
  },
  [Category.FUND]: {
    risk: 1,
    icon: BanknotesIcon,
  },
  [Category.FIAT_GATEWAY]: {
    risk: 1,
    icon: CurrencyDollarIcon,
  },
  [Category.OTHER]: {
    risk: 0,
    icon: UserIcon,
  },
};

export default CategoryClasses;
export type { CategoryClass };
