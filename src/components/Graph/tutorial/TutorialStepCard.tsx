import { Transition } from "@headlessui/react";
import { FC } from "react";

interface TutorialStepCardProps {
  Step: any;
  show: boolean;
}

const TutorialStepCard: FC<TutorialStepCardProps> = ({ Step, show }) => {
  return (
    <Transition
      appear
      show={show}
      enter="ease-out transition-all duration-500"
      enterFrom="opacity-0 -translate-x-1/2"
      enterTo="opacity-100 translate-x-0"
      leave="hidden duration-0"
      className="h-fit w-full"
    >
      <Step />
    </Transition>
  );
};

export default TutorialStepCard;
