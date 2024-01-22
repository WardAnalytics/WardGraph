import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  ArrowTrendingUpIcon,
  FireIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  QuestionMarkCircleIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

import {
  ArrowPathIcon,
  CursorArrowRaysIcon,
  EyeSlashIcon,
} from "@heroicons/react/16/solid";

import { FC, Fragment, useState } from "react";
import Tutorial from "./Tutorial";

import edgeManagementGIF from "../../assets/tutorial/edge-management.gif";
import explorationGIF from "../../assets/tutorial/exploration.gif";
import inspectionGIF from "../../assets/tutorial/inspection.gif";
import introductionGIF from "../../assets/tutorial/introduction.gif";

interface TutorialCardTitleProps {
  title: string;
  Icon: any;
  className?: string;
}

const TutorialCardTitle: FC<TutorialCardTitleProps> = ({
  title,
  Icon,
  className,
}) => {
  return (
    <div className={className}>
      <div className="flex flex-row items-center gap-x-2">
        <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
    </div>
  );
};

const IntroductionCard: FC = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <img
        src={introductionGIF}
        alt="Ward Graph Demonstration"
        className="rounded-lg"
      />
      <TutorialCardTitle
        title="Introducing: Ward Graph"
        Icon={RocketLaunchIcon}
      />
      <p className="text-sm text-gray-600">
        Ward Graph is a next-gen blockchain graph explorer with a focus on
        risk-scoring, user experience, and open-source.
      </p>
    </div>
  );
};

const InspectionCard: FC = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <img
        src={inspectionGIF}
        alt="Ward Graph Demonstration"
        className="rounded-lg"
      />
      <TutorialCardTitle title="Inspection" Icon={MagnifyingGlassIcon} />
      <p className="text-sm text-gray-600">
        To inspect an address, simply click the address node. You'll be able to
        see the relationship of the address with other entities.
      </p>
    </div>
  );
};

const ExplorationCard: FC = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <img
        src={explorationGIF}
        alt="Ward Graph Demonstration"
        className="rounded-lg"
      />
      <TutorialCardTitle title="Exploration" Icon={PlusCircleIcon} />
      <p className="text-sm text-gray-600">
        To expand to other addresses, you can click the 'Expand' button.
      </p>
    </div>
  );
};

const EdgeManagementCard: FC = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <img
        src={edgeManagementGIF}
        alt="Ward Graph Demonstration"
        className="rounded-lg"
      />
      <TutorialCardTitle title="Edge Management" Icon={ArrowTrendingUpIcon} />
      <p className="text-sm text-gray-600">
        There are a lot of transactions on the blockchain!
        <ul className="mt-3 flex flex-col gap-y-3 pl-3">
          <li className="flex flex-row items-center gap-x-1">
            <ArrowPathIcon className="h-4 w-4 text-gray-400" />
            Only the paths you expand through are shown by default.
          </li>
          <li className="flex flex-row items-center gap-x-1">
            <EyeSlashIcon className="h-4 w-4 text-gray-400" />
            You can inspect an address to see its hidden 'grayed-out' edges.
          </li>
          <li className="flex flex-row items-center gap-x-1">
            <CursorArrowRaysIcon className="h-4 w-4 text-gray-400" />
            Click the edges to toggle them on or off.
          </li>
        </ul>
      </p>
    </div>
  );
};

const GoodLuckCard: FC = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <img
        src={introductionGIF}
        alt="Ward Graph Demonstration"
        className="rounded-lg"
      />
      <TutorialCardTitle title="Good Luck!" Icon={FireIcon} />
      <p className="text-sm text-gray-600">
        That's it! You're ready to explore the blockchain. Good luck!
      </p>
    </div>
  );
};

interface TutorialPopupProps {
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
}

const TutorialPopup: FC<TutorialPopupProps> = ({
  showTutorial,
  setShowTutorial,
}) => {
  const [show, setShow] = useState(true);

  const tutorialSteps = [
    IntroductionCard,
    InspectionCard,
    ExplorationCard,
    EdgeManagementCard,
    GoodLuckCard,
  ];

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <QuestionMarkCircleIcon
                      className="h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      Need help?
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Do a 30 second tutorial to learn how to use Ward Graph.
                    </p>
                    <div className="mt-3 flex space-x-7">
                      <button
                        type="button"
                        className="rounded-md bg-white text-sm font-medium text-blue-500 hover:text-blue-400 focus:outline-none "
                        onClick={() => {
                          setShowTutorial(true);
                          setShow(false);
                        }}
                      >
                        Tutorial
                      </button>
                      <button
                        type="button"
                        className="rounded-md bg-white text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={() => {
                          setShow(false);
                        }}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
      <Tutorial
        show={showTutorial}
        setShow={setShowTutorial}
        steps={tutorialSteps}
      />
    </>
  );
};

export default TutorialPopup;
