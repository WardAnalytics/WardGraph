import { FC, useState } from "react";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Badge from "../components/common/Badge";
import { Colors } from "../utils/colors";
import {
  RocketLaunchIcon,
  CheckIcon,
  SparklesIcon,
  CreditCardIcon as CreditCardSmallIcon,
} from "@heroicons/react/20/solid";
import BigButton from "../components/common/BigButton";

const DiscoverPlan: FC = () => {
  return (
    <div className="my-5 flex w-72 flex-col rounded-3xl p-8 shadow-sm ring-1 ring-gray-200">
      <h3 className="flex flex-row items-center gap-x-2 text-lg font-semibold leading-8 text-gray-800">
        Discover
        <Badge color={Colors.BLUE} text="Current" className="h-fit" />
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

const ProPlan: FC = () => {
  return (
    <div className="flex w-96 flex-col rounded-3xl bg-gray-800 p-8 shadow-md">
      <h3 className="text-lg font-semibold leading-8 text-white">Pro</h3>
      <p className="mt-1 text-sm leading-6 text-gray-300">
        For investigators who want to speed up their workflow and take their
        analysis to the next level.
      </p>
      <p className="mt-4 text-4xl font-bold tracking-tight text-white">
        $49.99
        <span className="text-base font-normal text-gray-300">/mo</span>
      </p>
      <button className="mt-4 h-10 w-full rounded-md bg-blue-500 text-white transition-all duration-150 hover:bg-blue-400">
        Buy plan
      </button>
      <div className="mt-4 flex flex-col gap-y-1.5 text-gray-300">
        <span className="flex flex-row items-center gap-x-1 ">
          <CheckIcon className="h-4 w-4 text-white" />
          Unlimited graphs
        </span>
        <span className="flex flex-row items-center gap-x-1 text-blue-200">
          <SparklesIcon className="h-4 w-4 text-blue-400" />
          Unlimited AI usage
        </span>
        <span className="flex flex-row items-center gap-x-1">
          <CheckIcon className="h-4 w-4 text-white" />
          Unlimited advanced analysis
        </span>
        <span className="flex flex-row items-center gap-x-1">
          <CheckIcon className="h-4 w-4 text-white" />
          Unlimited API calls
        </span>
        <span className="flex flex-row items-center gap-x-1">
          <CheckIcon className="h-4 w-4 text-white" />
          Unlimited automations
        </span>
      </div>
    </div>
  );
};

const PRO = true;

const BillingTemplate: FC = () => {
  const [isPro, setIsPro] = useState<boolean>(PRO);

  return (
    <div className="mx-14 my-10 flex w-full flex-col gap-y-5">
      <h3 className="flex flex-row gap-x-2 text-xl font-semibold text-gray-700">
        <CreditCardIcon className="mt-0.5 inline-block h-7 w-7 text-gray-400" />
        Plan & Billing
      </h3>
      <div className="h-[1px] w-full bg-gray-200" />

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
            onClick={() => setIsPro(false)}
            Icon={CreditCardSmallIcon}
          />
        )}
      </span>
      <span className="flex flex-row justify-center gap-x-5">
        <DiscoverPlan />
        <ProPlan />
      </span>
    </div>
  );
};

export default BillingTemplate;
