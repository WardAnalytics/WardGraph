import clsx from "clsx";
import { FC } from "react";

interface SubscriptionPeriodButtonProps {
    isActive: boolean;
    subscriptionPeriodMode: SubscriptionPeriodMode;
    setSubscriptionPeriodMode: (mode: SubscriptionPeriodMode) => void;
}


export enum SubscriptionPeriodNames {
    MONTHLY = "Monthly",
    YEARLY = "Yearly",
}

export interface SubscriptionPeriodMode {
    name: SubscriptionPeriodNames;
    priceId: string;
    priceValueMonth: number;
    priceCurrency: string;
}

export const SubscriptionPeriodModes: SubscriptionPeriodMode[] = [
    {
        name: SubscriptionPeriodNames.MONTHLY,
        priceId: import.meta.env.VITE_PRO_PRICE_ID as string,
        priceValueMonth: 99.99,
        priceCurrency: "€",
    },
    {
        name: SubscriptionPeriodNames.YEARLY,
        priceId: import.meta.env.VITE_PRO_PRICE_YEARLY_ID as string,
        priceValueMonth: 83.33,
        priceCurrency: "€",
    },
];

const SubscriptionPeriodButton: FC<SubscriptionPeriodButtonProps> = ({
    isActive,
    subscriptionPeriodMode,
    setSubscriptionPeriodMode,
}) => {
    return (
        <button
            type="button"
            className={clsx(
                "flex flex-row items-center gap-x-1 rounded-md px-3 py-2 text-sm font-semibold",
                {
                    "bg-blue-500 text-white shadow-md": isActive,
                },
            )}
            onClick={() => setSubscriptionPeriodMode(subscriptionPeriodMode)}
        >
            <p
                className="w-fit-content"
                style={{
                    maxWidth: "5rem",
                    transition: "all 0.3s ease-in-out",
                }}
            >
                {subscriptionPeriodMode.name}
            </p>
        </button>
    );
};

interface SubscriptionPeriodToggleProps {
    subscriptionPeriodMode: SubscriptionPeriodMode;
    setSubscriptionPeriodMode: (mode: SubscriptionPeriodMode) => void;
}

const SubscriptionPeriodToggle: FC<SubscriptionPeriodToggleProps> = ({
    subscriptionPeriodMode, setSubscriptionPeriodMode
}) => {
    return (
        <span className="flex flex-row gap-x-0.5 rounded-lg border border-gray-300 bg-white p-1 shadow-inner ring-1 ring-inset ring-white">
            {SubscriptionPeriodModes.map((mode) => (
                <SubscriptionPeriodButton
                    key={mode.name}
                    isActive={mode === subscriptionPeriodMode}
                    subscriptionPeriodMode={mode}
                    setSubscriptionPeriodMode={setSubscriptionPeriodMode}
                />
            ))}
        </span>
    );
};

export default SubscriptionPeriodToggle;