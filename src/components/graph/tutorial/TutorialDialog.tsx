import {
  ArrowLeftIcon,
  ArrowRightIcon,
  RocketLaunchIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { FC, KeyboardEvent, useMemo, useState } from "react";
import BigButton from "../../common/BigButton";

import { logAnalyticsEvent } from "../../../services/firestore/analytics/analytics";
import { HotKeysType } from "../../../types/hotKeys";
import Modal from "../../common/Modal";
import TutorialStepCard from "./components/TutorialStepCard";
import tutorialSteps from "./steps";

interface TutorialProps {
  show: boolean;
  setShow: (show: boolean) => void;
  initialStep?: number;
}

interface ProgressCircleProps {
  isCompleted: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

const ProgressCircle: FC<ProgressCircleProps> = ({
  isCompleted,
  isCurrent,
  onClick,
}) => {
  return (
    <div
      className="flex h-4 w-4 cursor-pointer flex-row items-center justify-center align-middle"
      onClick={onClick}
    >
      {isCurrent && (
        <div className="absolute h-4 w-4 rounded-full bg-blue-200" />
      )}
      {
        <div
          className={clsx(
            "absolute h-2 w-2 rounded-full",
            isCompleted || isCurrent ? "bg-blue-500" : "bg-gray-200",
          )}
        />
      }
    </div>
  );
};

interface ProgressCirclesProps {
  currentStep: number;
  totalSteps: number;
  setCurrentStep: (step: number) => void;
}

const ProgressCircles: FC<ProgressCirclesProps> = ({
  currentStep,
  totalSteps,
  setCurrentStep,
}) => {
  // Number of circles to show at a time
  const maxVisibleCircles = 8;

  // Start index of the circles to show
  const start = Math.max(0, currentStep - Math.floor(maxVisibleCircles / 2));

  return (
    <div className="flex flex-row items-center justify-center gap-x-2">
      {Array.from(Array(maxVisibleCircles).keys()).map((index) => {
        const step = start + index;
        // TODO: Add slide transition to the progress circles, like a carousel
        return (
          step < totalSteps && (
            <ProgressCircle
              key={step}
              isCompleted={step < currentStep}
              isCurrent={step === currentStep}
              onClick={() => setCurrentStep(step)}
            />
          )
        );
      })}
    </div>
  );
};

const TutorialDialog: FC<TutorialProps> = ({
  show: isTutorialOpen,
  setShow: setIsTutorialOpen,
  initialStep = 0,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const steps = useMemo(() => tutorialSteps, []);

  // Hotkeys for tutorial
  // ArrowLeft: Go to previous slide
  // ArrowRight: Go to next slide
  const hotKeysMap: HotKeysType = {
    ARROW_LEFT: {
      key: "ArrowLeft",
      asyncHandler: async (event: KeyboardEvent<HTMLElement>) => {
        event.preventDefault();

        decreaseSlide();
        logAnalyticsEvent("tutorial_arrow_left");
      },
    },
    ARROW_RIGHT: {
      key: "ArrowRight",
      asyncHandler: async (event: KeyboardEvent<HTMLElement>) => {
        event.preventDefault();

        increaseSlide();
        logAnalyticsEvent("tutorial_arrow_right");
      },
    },
  };

  const increaseSlide = () => {
    if (currentStep === steps.length - 1) {
      closeTutorial();
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const decreaseSlide = () => {
    if (currentStep === 0) return;
    setCurrentStep(currentStep - 1);
  };

  const closeTutorial = () => {
    setIsTutorialOpen(false);
    setCurrentStep(0);
    logAnalyticsEvent("tutorial_closed");
  };

  return (
    <Modal isOpen={isTutorialOpen} closeModal={closeTutorial}>
      <div
        className="w-[30rem]"
        onKeyDown={async (event: KeyboardEvent<HTMLElement>) => {
          const hotKey = event.key;
          switch (hotKey) {
            case hotKeysMap.ARROW_LEFT.key:
              await hotKeysMap.ARROW_LEFT.asyncHandler!(event);
              break;
            case hotKeysMap.ARROW_RIGHT.key:
              await hotKeysMap.ARROW_RIGHT.asyncHandler!(event);
              break;
          }
        }}
      >
        <div className="mb-2 flex w-full justify-end">
          <XMarkIcon
            className="h-11 w-11 cursor-pointer rounded-full p-1.5 text-gray-400 transition-all duration-300 hover:bg-gray-100"
            aria-hidden="true"
            onClick={closeTutorial}
          />
        </div>
        <div className="flex w-full flex-col items-center">
          <div className="flex min-h-[20rem] w-full flex-row justify-center overflow-hidden">
            {steps.map((step, index) => {
              return (
                <TutorialStepCard
                  Step={step}
                  key={index}
                  show={index === currentStep}
                />
              );
            })}
          </div>
          <div className=" mt-10 flex w-full justify-between">
            {currentStep !== 0 ? (
              <BigButton
                onClick={() => {
                  decreaseSlide();
                }}
                text="Previous"
                Icon={ArrowLeftIcon}
                className="w-28 ring-0"
              />
            ) : (
              <div className="w-28 ring-0 hover:bg-white" />
            )}
            <ProgressCircles
              currentStep={currentStep}
              totalSteps={steps.length}
              setCurrentStep={setCurrentStep}
            />
            {currentStep !== steps.length - 1 ? (
              <BigButton
                onClick={() => {
                  increaseSlide();
                }}
                text="Next"
                Icon={ArrowRightIcon}
                className="w-28 ring-0 hover:bg-white"
              />
            ) : (
              <BigButton
                onClick={closeTutorial}
                text="Done"
                Icon={RocketLaunchIcon}
                className="w-28"
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TutorialDialog;
