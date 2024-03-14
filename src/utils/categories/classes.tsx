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

// Also import all icons as small icons
import {
  NoSymbolIcon as NoSymbolIconSmall,
  CreditCardIcon as CreditCardIconSmall,
  CpuChipIcon as CpuChipIconSmall,
  LockClosedIcon as LockClosedIconSmall,
  CurrencyDollarIcon as CurrencyDollarIconSmall,
  EnvelopeIcon as EnvelopeIconSmall,
  ExclamationCircleIcon as ExclamationCircleIconSmall,
  ArrowPathRoundedSquareIcon as ArrowPathRoundedSquareIconSmall,
  CubeIcon as CubeIconSmall,
  ArrowsPointingInIcon as ArrowsPointingInIconSmall,
  ArrowTopRightOnSquareIcon as ArrowTopRightOnSquareIconSmall,
  BoltIcon as BoltIconSmall,
  WalletIcon as WalletIconSmall,
  BuildingLibraryIcon as BuildingLibraryIconSmall,
  ShieldCheckIcon as ShieldCheckIconSmall,
  PhotoIcon as PhotoIconSmall,
  ShoppingCartIcon as ShoppingCartIconSmall,
  CloudIcon as CloudIconSmall,
  EyeDropperIcon as EyeDropperIconSmall,
  BanknotesIcon as BanknotesIconSmall,
  UserIcon as UserIconSmall,
} from "@heroicons/react/16/solid";

import Category from "./enum";

type CategoryClass = {
  risk: number;
  icon: React.FC;
  iconSmall: React.FC;
};

const CategoryClasses: Record<string, CategoryClass> = {
  [Category.GOVERNMENT_CRIMINAL_BLACKLIST]: {
    risk: 10,
    icon: NoSymbolIcon,
    iconSmall: NoSymbolIconSmall,
  },
  [Category.DARKNET_MARKET]: {
    risk: 10,
    icon: NoSymbolIcon,
    iconSmall: NoSymbolIconSmall,
  },
  [Category.DARK_MARKET]: {
    risk: 10,
    icon: NoSymbolIcon,
    iconSmall: NoSymbolIconSmall,
  },
  [Category.DARKNET]: {
    risk: 10,
    icon: NoSymbolIcon,
    iconSmall: NoSymbolIconSmall,
  },
  [Category.PHISHING_HACKING]: {
    risk: 7.5,
    icon: CpuChipIcon,
    iconSmall: CpuChipIconSmall,
  },
  [Category.RANSOMWARE]: {
    risk: 7.5,
    icon: LockClosedIcon,
    iconSmall: LockClosedIconSmall,
  },
  [Category.MONEY_LAUNDERING]: {
    risk: 7.5,
    icon: CurrencyDollarIcon,
    iconSmall: CurrencyDollarIconSmall,
  },
  [Category.BLACKMAIL]: {
    risk: 7.5,
    icon: EnvelopeIcon,
    iconSmall: EnvelopeIconSmall,
  },
  [Category.SCAM]: {
    risk: 7.5,
    icon: ExclamationCircleIcon,
    iconSmall: ExclamationCircleIconSmall,
  },
  [Category.TUMBLER]: {
    risk: 7.5,
    icon: ArrowPathRoundedSquareIcon,
    iconSmall: ArrowPathRoundedSquareIconSmall,
  },
  [Category.MIXER]: {
    risk: 7.5,
    icon: ArrowPathRoundedSquareIcon,
    iconSmall: ArrowPathRoundedSquareIconSmall,
  },
  [Category.PARITY_BUG]: {
    risk: 7.5,
    icon: ExclamationCircleIcon,
    iconSmall: ExclamationCircleIconSmall,
  },
  [Category.PONZI_SCHEME]: {
    risk: 7.5,
    icon: CurrencyDollarIcon,
    iconSmall: CurrencyDollarIconSmall,
  },
  [Category.BLOCKED]: {
    risk: 5,
    icon: NoSymbolIcon,
    iconSmall: NoSymbolIconSmall,
  },
  [Category.GAMBLING]: {
    risk: 5,
    icon: CubeIcon,
    iconSmall: CubeIconSmall,
  },
  [Category.DEFI]: {
    risk: 5,
    icon: ArrowsPointingInIcon,
    iconSmall: ArrowsPointingInIconSmall,
  },
  [Category.DEX]: {
    risk: 5,
    icon: ArrowsPointingInIcon,
    iconSmall: ArrowsPointingInIconSmall,
  },
  [Category.BRIDGE]: {
    risk: 5,
    icon: ArrowTopRightOnSquareIcon,
    iconSmall: ArrowTopRightOnSquareIconSmall,
  },
  [Category.MEV_BOT]: {
    risk: 5,
    icon: BoltIcon,
    iconSmall: BoltIconSmall,
  },
  [Category.P2P_FINANCIAL_INFRASTRUCTURE_SERVICE]: {
    risk: 2.5,
    icon: ArrowsPointingInIcon,
    iconSmall: ArrowsPointingInIconSmall,
  },
  [Category.P2P_FINANCIAL_SERVICE]: {
    risk: 2.5,
    icon: ArrowsPointingInIcon,
    iconSmall: ArrowsPointingInIconSmall,
  },
  [Category.WALLET]: {
    risk: 2.5,
    icon: WalletIcon,
    iconSmall: WalletIconSmall,
  },
  [Category.CUSTODIAL_WALLET]: {
    risk: 1,
    icon: WalletIcon,
    iconSmall: WalletIconSmall,
  },
  [Category.CENTRALIZED_EXCHANGE]: {
    risk: 1,
    icon: BuildingLibraryIcon,
    iconSmall: BuildingLibraryIconSmall,
  },
  [Category.CYBER_SECURITY_SERVICE]: {
    risk: 1,
    icon: ShieldCheckIcon,
    iconSmall: ShieldCheckIconSmall,
  },
  [Category.EXCHANGE]: {
    risk: 1,
    icon: BuildingLibraryIcon,
    iconSmall: BuildingLibraryIconSmall,
  },
  [Category.NFT_MARKETPLACE]: {
    risk: 1,
    icon: PhotoIcon,
    iconSmall: PhotoIconSmall,
  },
  [Category.MARKETPLACE]: {
    risk: 1,
    icon: ShoppingCartIcon,
    iconSmall: ShoppingCartIconSmall,
  },
  [Category.CLOUD_MINING]: {
    risk: 1,
    icon: CloudIcon,
    iconSmall: CloudIconSmall,
  },
  [Category.FAUCET]: {
    risk: 1,
    icon: EyeDropperIcon,
    iconSmall: EyeDropperIconSmall,
  },
  [Category.PAYMENT_PROCESSOR]: {
    risk: 1,
    icon: CreditCardIcon,
    iconSmall: CreditCardIconSmall,
  },
  [Category.MINING_POOL]: {
    risk: 1,
    icon: CubeIcon,
    iconSmall: CubeIconSmall,
  },
  [Category.E_COMMERCE]: {
    risk: 1,
    icon: ShoppingCartIcon,
    iconSmall: ShoppingCartIconSmall,
  },
  [Category.FUND]: {
    risk: 1,
    icon: BanknotesIcon,
    iconSmall: BanknotesIconSmall,
  },
  [Category.FIAT_GATEWAY]: {
    risk: 1,
    icon: CurrencyDollarIcon,
    iconSmall: CurrencyDollarIconSmall,
  },
  [Category.OTHER]: {
    risk: 0,
    icon: UserIcon,
    iconSmall: UserIconSmall,
  },
};

export default CategoryClasses;
export type { CategoryClass };
