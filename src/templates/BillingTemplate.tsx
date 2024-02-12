import {
  CheckIcon,
  CreditCardIcon as CreditCardSmallIcon,
  RocketLaunchIcon,
  SparklesIcon,
} from "@heroicons/react/20/solid";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { FC, useEffect, useMemo, useState } from "react";
import Badge from "../components/common/Badge";
import BigButton from "../components/common/BigButton";
import useAuthState from "../hooks/useAuthState";
import { usePremiumStatus } from "../services/firestore/user/premium/premium";
import { Subscription, useActiveSubscriptions, useCheckoutSessionUrl, useCustomerPortalUrl } from "../services/stripe";
import { Colors } from "../utils/colors";

interface PlanProps {
  isPro: boolean;
  isLoading?: boolean;
  setIsLoading?: (isLoading: boolean) => void;
}

const DiscoverPlan: FC<PlanProps> = ({ isPro }) => {
  return (
    <div className="my-5 flex w-72 flex-col rounded-3xl p-8 shadow-sm ring-1 ring-gray-200">
      <h3 className="flex flex-row items-center gap-x-2 text-lg font-semibold leading-8 text-gray-800">
        Discover
        {!isPro && (
          <Badge color={Colors.BLUE} text="Current" className="h-fit" />
        )}
      </h3>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Great for beginner investigators to satisfy their curiosity.
      </p>
      <p className="mt-4 text-4xl font-bold tracking-tight text-gray-800">
        Free
      </p>
      <div className="mt-4 h-[1px] w-full bg-gray-200" />
      <div className="mt-4 flex flex-col gap-y-1.5 text-gray-700">
        <span className="flex flex-row items-center gap-x-1">
          <CheckIcon className="h-4 w-4 text-blue-400" />
          Graph searching
        </span>
        <span className="flex flex-row items-center gap-x-1">
          <CheckIcon className="h-4 w-4 text-blue-400" />1 Automation
        </span>
        <span className="flex flex-row items-center gap-x-1">
          <CheckIcon className="h-4 w-4 text-blue-400" />
          Limited advanced analysis
        </span>
        <span className="flex flex-row items-center gap-x-1">
          <CheckIcon className="h-4 w-4 text-blue-400" />
          Limited AI usage
        </span>
      </div>
    </div>
  );
};

interface ProPlanProps extends PlanProps {
  userID: string;
  subscription: Subscription;
}

const ProPlan: FC<ProPlanProps> = ({
  isPro,
  userID,
  subscription,
}) => {
  const priceId = import.meta.env.VITE_STRIPE_ONE_MONTH_SUBSCRIPTION_PRICE_ID as string;

  const [buyPlanClicked, setBuyPlanClicked] = useState<boolean>(false);

  const { url: checkoutSessionUrl, loading: isLoadingCheckoutSession, refetch: getCheckoutSession } = useCheckoutSessionUrl(priceId, userID, { enabled: false });

  useEffect(() => {
    if (buyPlanClicked) {
      getCheckoutSession();
      setBuyPlanClicked(false);
    }
  }, [buyPlanClicked]);

  useEffect(() => {
    if (checkoutSessionUrl) {
      window.location.href = checkoutSessionUrl;
    }
  }, [checkoutSessionUrl]);

  return (
    <div className="relative flex w-96 flex-col overflow-hidden rounded-3xl bg-gray-800 p-8 shadow-md">
      <h3 className="flex flex-row items-center gap-x-2 text-lg font-semibold leading-8 text-white">
        {subscription.name}
        {isPro && (
          <Badge color={Colors.BLUE_DARK} text="Current" className="h-fit" />
        )}
      </h3>
      <p className="mt-1 text-sm leading-6 text-gray-300">
        {subscription.description}
      </p>
      <p className="mt-4 text-4xl font-bold tracking-tight text-white">
        €{subscription.price.amount.toFixed(2)}
        <span className="text-base font-normal text-gray-300">/mo</span>
        <svg
          viewBox="0 0 1208 1024"
          className="pointer-events-none absolute top-0 h-[20rem] opacity-[7%] [mask-image:radial-gradient(closest-side,white,transparent)]"
        >
          <ellipse
            cx={604}
            cy={512}
            fill="url(#6d1bd035-0dd1-437e-93fa-59d316231eb0)"
            rx={604}
            ry={512}
          />
          <defs>
            <radialGradient id="6d1bd035-0dd1-437e-93fa-59d316231eb0">
              <stop stopColor="#93c5fd" />
              <stop offset={1} stopColor="#93c5fd" />
            </radialGradient>
          </defs>
        </svg>
      </p>
      {isPro ? (
        <div className="mt-4 h-[1px] w-full bg-gray-700" />
      ) : (
        <button
          className={clsx(
            "mt-4 h-10 w-full rounded-md bg-blue-500 text-white transition-all duration-150 hover:bg-blue-400",
            isLoadingCheckoutSession &&
            "text-gray-3 bg-blue-900 hover:cursor-not-allowed hover:bg-blue-900",
          )}
          onClick={() => setBuyPlanClicked(true)}
          type="button"
          disabled={isLoadingCheckoutSession}
        >
          Buy plan
        </button>
      )}
      <div className="mt-4 flex flex-col gap-y-1.5 text-gray-300">
        <span className="flex flex-row items-center gap-x-1 ">
          <CheckIcon className="h-4 w-4 text-white" />
          Multiple graphs
        </span>
        <span className="flex flex-row items-center gap-x-1 text-blue-200">
          <SparklesIcon className="h-4 w-4 text-blue-400" />
          Unlimited AI usage
        </span>
        <span className="flex flex-row items-center gap-x-1">
          <CheckIcon className="h-4 w-4 text-white" />
          Advanced analysis
        </span>
        <span className="flex flex-row items-center gap-x-1">
          <CheckIcon className="h-4 w-4 text-white" />
          API access
        </span>
        <span className="flex flex-row items-center gap-x-1">
          <CheckIcon className="h-4 w-4 text-white" />
          Automations
        </span>
      </div>
    </div>
  );
};

interface EnterprisePlanProps {
  isLoading: boolean;
}

const EnterprisePlan: FC<EnterprisePlanProps> = ({ isLoading = false }) => {
  return (
    <div className="my-5 flex w-72 flex-col rounded-3xl p-8 shadow-sm ring-1 ring-gray-200">
      <h3 className="flex flex-row items-center gap-x-2 text-lg font-semibold leading-8 text-gray-800">
        Enterprise
      </h3>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Tailormade to your needs.
      </p>
      <p className="mt-4 text-4xl font-bold tracking-tight text-gray-800">
        Custom
      </p>
      <button
        className={clsx(
          "bg-white-500 mt-4 h-10 w-full rounded-md text-gray-600 shadow-sm ring-1 ring-inset ring-gray-200 transition-all duration-150 hover:bg-gray-50",
          isLoading &&
          "text-gray-3 bg-gray-300 hover:cursor-not-allowed hover:bg-gray-300",
        )}
        disabled={isLoading}
      >
        Contact Us
      </button>
      <div className="mt-4 flex flex-col gap-y-1.5 text-gray-700">
        <span className="flex flex-row items-center gap-x-1">
          <CheckIcon className="h-4 w-4 text-blue-400" />
          Tailormade features
        </span>
        <span className="flex flex-row items-center gap-x-1">
          <CheckIcon className="h-4 w-4 text-blue-400" />
          Custom automations
        </span>
        <span className="flex flex-row items-center gap-x-1">
          <CheckIcon className="h-4 w-4 text-blue-400" />
          Dedicated support
        </span>
        <span className="flex flex-row items-center gap-x-1">
          <CheckIcon className="h-4 w-4 text-blue-400" />
          API integrations
        </span>
      </div>
    </div>
  );
};

const BillingTemplate: FC = () => {
  const [manageSubscriptionClicked, setManageSubscriptionClicked] = useState<boolean>(false);

  const { user } = useAuthState();
  const userID = user?.uid || "";

  const { isPremium: isPro, loading: isLoadingPremiumStatus } = usePremiumStatus(userID);

  const { url: customerPortalUrl, loading: isLoadingCustomerPortalUrl, refetch: getCustomerPortalUrl } = useCustomerPortalUrl(userID, { enabled: false });

  const { subscriptions, loading: isLoadingActiveSubscriptions } = useActiveSubscriptions();

  console.log(subscriptions);

  const isLoading = useMemo(() => {
    return isLoadingPremiumStatus || isLoadingActiveSubscriptions || isLoadingCustomerPortalUrl;
  }, [isLoadingPremiumStatus, isLoadingActiveSubscriptions, isLoadingCustomerPortalUrl]);

  useEffect(() => {
    if (manageSubscriptionClicked) {
      getCustomerPortalUrl();
      setManageSubscriptionClicked(false);
    }
  }, [manageSubscriptionClicked]);

  useEffect(() => {
    if (customerPortalUrl) {
      window.location.href = customerPortalUrl;
    }
  }, [customerPortalUrl]);

  return (
    <div className="mx-14 my-10 flex w-full flex-col gap-y-5">
      <h3 className="flex flex-row gap-x-2 text-xl font-semibold text-gray-700">
        <CreditCardIcon className="mt-0.5 inline-block h-7 w-7 text-gray-400" />
        Plan & Billing
      </h3>
      <div className="h-[1px] w-full bg-gray-200" />

      {
        // TODO: Replace for a loading component to standardize the loading state
        isLoadingPremiumStatus ? (
          <div className="flex flex-col items-center gap-y-2.5">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <>
            <span className="flex flex-row justify-between">
              <h3 className="flex flex-row items-center gap-x-2.5 text-xl font-semibold text-gray-700">
                Plan:
                {isPro ? (
                  <p className=" flex flex-row items-center gap-x-1.5 rounded-lg bg-blue-100 px-2 py-1 font-bold text-blue-500 shadow-lg shadow-blue-200/50 ring-1 ring-inset ring-blue-300">
                    <RocketLaunchIcon className="mt-0.5 inline-block h-5 w-5 text-blue-500" />
                    Pro
                  </p>
                ) : (
                  <p className="text-gray-500">Free</p>
                )}
              </h3>
              {isPro && (
                <BigButton
                  text="Manage Subscription"
                  onClick={() => setManageSubscriptionClicked(true)}
                  Icon={CreditCardSmallIcon}
                />
              )}
            </span>
            <span className="flex flex-row justify-center gap-x-5">
              <DiscoverPlan isPro={isPro} />
              {subscriptions.length > 0 &&
                subscriptions.map((subscription) => (
                  <ProPlan
                    key={subscription.id}
                    isPro={isPro}
                    userID={userID}
                    subscription={subscription}
                  />
                ))
              }
              <EnterprisePlan isLoading={isLoading} />
            </span>
          </>
        )
      }
    </div>
  );
};

export default BillingTemplate;
