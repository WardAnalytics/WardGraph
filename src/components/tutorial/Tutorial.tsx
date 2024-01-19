import clsx from "clsx";
import { FC, useEffect, useState } from "react";
import Modal from "../common/Modal";
import TutorialStepCard, { TutorialStep } from "./TutorialStepCard";

interface TutorialProps {
    show: boolean;
    setShow: (show: boolean) => void;
    steps: TutorialStep[];
    initialStep?: number;
    className?: string;
}

enum SlidesDirection {
    STILL,
    NEXT,
    PREV
}

const Tutorial: FC<TutorialProps> = ({
    show: isTutorialOpen,
    setShow: setIsTutorialOpen,
    steps,
    initialStep = 0,
    className
}) => {
    const [currentStep, setCurrentStep] = useState(initialStep);

    const [slideDirection, setSlideDirection] = useState<SlidesDirection>(SlidesDirection.STILL);

    const onSlideButtonClick = (direction: SlidesDirection) => {
        setSlideDirection(direction);
    }

    const changeSlide = () => {
        switch (slideDirection) {
            case SlidesDirection.NEXT:
                setCurrentStep(currentStep + 1);
                break;
            case SlidesDirection.PREV:
                setCurrentStep(currentStep - 1);
                break;
            default:
                break;
        }
        setSlideDirection(SlidesDirection.STILL);
    }

    const closeTutorial = () => {
        setIsTutorialOpen(false);
    }

    useEffect(() => {
        changeSlide();
    }, [slideDirection]);

    return (
        <Modal isOpen={isTutorialOpen} closeModal={closeTutorial}>
            <div className={className}>
                <div className="flex justify-end mb-2">
                    <button
                        type="button"
                        className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={closeTutorial}
                    >
                        X
                    </button>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex justify-center">
                        <TutorialStepCard
                            step={steps[currentStep]}
                            className={clsx(
                                "transition-all duration-500",
                                slideDirection === SlidesDirection.NEXT ? "translate-x-full" : "",
                                slideDirection === SlidesDirection.PREV ? "-translate-x-full" : "",
                            )}
                        />
                    </div>
                    <div className="flex w-full justify-between mt-4">
                        {currentStep !== 0
                            ?
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                                onClick={() => onSlideButtonClick(SlidesDirection.PREV)}
                            >
                                <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                    fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd"
                                        d="M10.707 3.293a1 1 0 010 1.414L6.414 9H15a1 1 0 010 2H6.414l4.293 4.293a1 1 0
                                    01-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z"
                                        clipRule="evenodd" />
                                </svg>
                                Previous
                            </button>
                            :
                            <div />
                        }
                        {
                            currentStep !== steps.length - 1
                                ?
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                                    onClick={() => onSlideButtonClick(SlidesDirection.NEXT)}
                                    disabled={currentStep === steps.length - 1}
                                >
                                    Next
                                    <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                        fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd"
                                            d="M9.293 16.707a1 1 0 010-1.414L13.586 11H5a1 1 0 010-2h8.586l-4.293
                                    -4.293a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0
                                    01-1.414 0z"
                                            clipRule="evenodd" />
                                    </svg>
                                </button>
                                :
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                                    onClick={closeTutorial}
                                >
                                    Done
                                </button>
                        }
                    </div>
                </div>
            </div>
        </Modal >
    );
}

export default Tutorial;
