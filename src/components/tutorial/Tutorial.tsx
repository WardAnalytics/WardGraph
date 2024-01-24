import { FC, useEffect, useState, useMemo } from "react";
import clsx from "clsx";
import BigButton from "../common/BigButton";
import {
  XMarkIcon,
  RocketLaunchIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

import Modal from "../common/Modal";
import TutorialStepCard from "./TutorialStepCard";
import { useKeyPress } from "reactflow";

enum HotKeyMap {
  ARROW_LEFT = 1,
  ARROW_RIGHT,
}

interface TutorialProps {
  show: boolean;
  setShow: (show: boolean) => void;
  steps: any[];
  initialStep?: number;
}

enum SlidesDirection {
  STILL,
  NEXT,
  PREV,
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
            isCompleted ? "bg-blue-500" : "bg-gray-200",
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
  return (
    <div className="flex flex-row items-center justify-center gap-x-2">
      {Array.from(Array(totalSteps).keys()).map((step) => {
        return (
          <ProgressCircle
            key={step}
            isCompleted={step <= currentStep}
            isCurrent={step === currentStep}
            onClick={() => {
              setCurrentStep(step);
            }}
          />
        );
      })}
    </div>
  );
};

const Tutorial: FC<TutorialProps> = ({
  show: isTutorialOpen,
  setShow: setIsTutorialOpen,
  steps,
  initialStep = 0,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [slideDirection, setSlideDirection] = useState<SlidesDirection>(
    SlidesDirection.STILL,
  );

  // Hotkeys
  const leftArrowPressed = useKeyPress("ArrowLeft") ? HotKeyMap.ARROW_LEFT : 0;
  const rightArrowPressed = useKeyPress("ArrowRight")
    ? HotKeyMap.ARROW_RIGHT
    : 0;

  const keyPressed = useMemo(() => {
    return leftArrowPressed + rightArrowPressed;
  }, [leftArrowPressed, rightArrowPressed]);

  const onSlideButtonClick = (direction: SlidesDirection) => {
    setSlideDirection(direction);
  };

  const changeSlide = () => {
    switch (slideDirection) {
      case SlidesDirection.NEXT:
        if (currentStep === steps.length - 1) {
          closeTutorial();
          return;
        }
        setCurrentStep(currentStep + 1);
        break;
      case SlidesDirection.PREV:
        setCurrentStep(currentStep - 1);
        break;
      default:
        break;
    }
    setSlideDirection(SlidesDirection.STILL);
  };

  useEffect(() => {
    switch (keyPressed) {
      case HotKeyMap.ARROW_LEFT:
        onSlideButtonClick(SlidesDirection.PREV);
        break;
      case HotKeyMap.ARROW_RIGHT:
        onSlideButtonClick(SlidesDirection.NEXT);
        break;
      default:
        break;
    }
  }, [keyPressed]);

  const closeTutorial = () => {
    setIsTutorialOpen(false);
    setCurrentStep(0);
  };

  useEffect(() => {
    changeSlide();
  }, [slideDirection]);

  return (
    <Modal isOpen={isTutorialOpen} closeModal={closeTutorial}>
      <div className="w-[30rem]">
        <div className="mb-2 flex w-full justify-end">
          <XMarkIcon
            className="h-7 w-7 cursor-pointer p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-hidden="true"
            onClick={closeTutorial}
          />
        </div>
        <div className="flex w-full flex-col items-center">
          <div className="flex min-h-[20rem] w-fit flex-row justify-center overflow-hidden">
            {steps.map((_, index) => {
              return (
                <TutorialStepCard
                  Step={steps[index]}
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
                  onSlideButtonClick(SlidesDirection.NEXT);
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
                  onSlideButtonClick(SlidesDirection.NEXT);
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

export default Tutorial;
