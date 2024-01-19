import { FC } from 'react';

export interface TutorialStep {
    title: string;
    description: string;
    image: string;
}

interface TutorialStepCardProps {
    step: TutorialStep;
    className?: string;
}

const TutorialStepCard: FC<TutorialStepCardProps> = ({
    step,
    className
}) => {

    return (
        <div className={className}>
            <div className="flex flex-col items-center gap-y-4">
                <img src={step.image} alt={step.title} className="w-2/3" />
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-lg text-center">{step.description}</p>
            </div>
        </div>
    );
}

export default TutorialStepCard;