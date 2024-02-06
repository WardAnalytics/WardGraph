import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  QuestionMarkCircleIcon,
  RocketLaunchIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  ArrowTrendingUpIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

import {
  EyeSlashIcon,
  CursorArrowRaysIcon,
  ArrowPathIcon,
} from "@heroicons/react/16/solid";

import { FC, Fragment, useState } from "react";
import Tutorial from "./Tutorial";

import introductionGIF from "../../../assets/tutorial/introduction.gif";
import inspectionGIF from "../../../assets/tutorial/inspection.gif";
import explorationGIF from "../../../assets/tutorial/exploration.gif";
import edgeManagementGIF from "../../../assets/tutorial/edge-management.gif";

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

interface TutorialImageProps {
  src: string;
  alt: string;
}

const TutorialImage: FC<TutorialImageProps> = ({ src, alt }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="aspect-video w-full rounded-lg p-1 shadow-inner">
      {!imageLoaded && (
        <div className="h-full w-full animate-pulse rounded-lg bg-gray-300 shadow"></div>
      )}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full rounded-lg shadow ${
          imageLoaded ? "block" : "hidden"
        }`}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
};

const IntroductionCard: FC = () => {
  return (
    <div className="flex w-full flex-col gap-y-2">
      <TutorialImage src={introductionGIF} alt="Ward Graph Demonstration" />
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
    <div className="flex w-full flex-col gap-y-2">
      <TutorialImage src={inspectionGIF} alt="Ward Graph Demonstration" />
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
    <div className="flex w-full flex-col gap-y-2">
      <TutorialImage src={explorationGIF} alt="Ward Graph Demonstration" />
      <TutorialCardTitle title="Exploration" Icon={PlusCircleIcon} />
      <p className="text-sm text-gray-600">
        To expand to other addresses, you can click the 'Expand' button.
      </p>
    </div>
  );
};

const EdgeManagementCard: FC = () => {
  return (
    <div className="flex w-full flex-col gap-y-2">
      <TutorialImage src={edgeManagementGIF} alt="Ward Graph Demonstration" />
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
    <div className="flex w-full flex-col gap-y-2">
      <TutorialImage src={introductionGIF} alt="Ward Graph Demonstration" />
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
        className="pointer-events-none fixed inset-0 z-50 flex items-start px-4 py-6"
      >
        <div className="flex w-full flex-col items-end space-y-4">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 translate-y-0 translate-x-2"
            enterTo="translate-y-0 opacity-100 translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto mt-5 w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
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
                      <XMarkIcon
                        className="h-8 w-8 cursor-pointer rounded-full p-1.5 text-gray-400 transition-all duration-300 hover:bg-gray-100"
                        aria-hidden="true"
                      />
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
