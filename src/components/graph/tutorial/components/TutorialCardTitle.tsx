import { FC } from "react";

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

export default TutorialCardTitle;