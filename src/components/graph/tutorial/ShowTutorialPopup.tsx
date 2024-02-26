import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  QuestionMarkCircleIcon
} from "@heroicons/react/24/outline";

import { FC, Fragment, useState } from "react";

import useAuthState from "../../../hooks/useAuthState";
import TutorialDialog from "./TutorialDialog";
import tutorialSteps from "./steps";


interface ShowTutorialPopupProps {
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
}

const ShowTutorialPopup: FC<ShowTutorialPopupProps> = ({
  showTutorial,
  setShowTutorial,
}) => {
  const [show, setShow] = useState(!useAuthState().isAuthenticated);

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
                      Complete a 30 second tutorial to learn how to use Ward
                      Graph.
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
      <TutorialDialog
        show={showTutorial}
        setShow={setShowTutorial}
        steps={tutorialSteps}
      />
    </>
  );
};

export default ShowTutorialPopup;
