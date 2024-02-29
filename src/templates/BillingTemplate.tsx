import {
  CreditCardIcon as CreditCardSmallIcon,
  RocketLaunchIcon
} from "@heroicons/react/20/solid";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { FC, useEffect, useMemo, useState } from "react";
import BigButton from "../components/common/BigButton";
import useAuthState from "../hooks/useAuthState";
import { logAnalyticsEvent } from "../services/firestore/analytics/analytics";
import { usePremiumStatus } from "../services/firestore/user/premium/premium";
import {
  useActiveSubscription,
  useCustomerPortalUrl
} from "../services/stripe";
import { PlansList } from "../components/premium";
import SEO from "../components/common/SEO";

const BillingTemplate: FC = () => {
  const [manageSubscriptionClicked, setManageSubscriptionClicked] =
    useState<boolean>(false);

  const { userID } = useAuthState();

  const { isPremium: isPro, loading: isLoadingPremiumStatus } =
    usePremiumStatus(userID);

  const {
    url: customerPortalUrl,
    loading: isLoadingCustomerPortalUrl,
    refetch: getCustomerPortalUrl,
  } = useCustomerPortalUrl(userID, { enabled: false });

  const { subscription, loading: isLoadingActiveSubscription } =
    useActiveSubscription();

  const isLoading = useMemo(() => {
    return (
      isLoadingPremiumStatus ||
      isLoadingActiveSubscription ||
      isLoadingCustomerPortalUrl
    );
  }, [
    isLoadingPremiumStatus,
    isLoadingActiveSubscription,
    isLoadingCustomerPortalUrl,
  ]);

  useEffect(() => {
    if (manageSubscriptionClicked) {
      logAnalyticsEvent("click_manage_subscription");
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
    <>
      <SEO title="Billing" description="Manage your subscription and billing" />
      <div className="mx-14 my-10 flex w-full flex-col gap-y-5">
        <h3 className="flex flex-row gap-x-2 text-xl font-semibold text-gray-700">
          <CreditCardIcon className="mt-0.5 inline-block h-7 w-7 text-gray-400" />
          Plan & Billing
        </h3>
        <div className="h-[1px] w-full bg-gray-200" />

        {
          // TODO: Replace for a loading component to standardize the loading state
          <>
            <span className="flex flex-row justify-between">
              <h3 className="flex flex-row items-center gap-x-2.5 text-xl font-semibold text-gray-700">
                Plan:
                {isLoading ? (
                  <div className="h-7 w-16 animate-pulse rounded-md bg-gray-200" />
                ) : isPro ? (
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
            </span >
            <PlansList
              isPro={isPro}
              userID={userID}
              subscription={subscription}
              successRedirectPath="graph/new"
              cancelRedirectPath="billing"
            />
          </>
        }
      </div >
    </>
  );
};

export default BillingTemplate;
