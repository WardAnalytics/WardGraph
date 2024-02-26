import { FC } from "react";

interface TutorialCardListItemsProps {
    text: string;
    Icon?: any;
}

const TutorialCardListItems: FC<TutorialCardListItemsProps> = ({
    text,
    Icon
}) => {
    return (
        <li className="flex flex-row items-center gap-x-1">
            {Icon && <Icon className="h-4 w-4 text-gray-400" />}
            {text}
        </li>
    );
};

interface TutorialCardListProps {
    items: TutorialCardListItemsProps[];
}

const TutorialCardList: FC<TutorialCardListProps> = ({ items }) => {
    return (
        <ul className="mt-3 flex flex-col gap-y-3 pl-3">
            {items.map((item, index) => (
                <TutorialCardListItems key={index} {...item} />
            ))}
        </ul>
    );
}

export default TutorialCardList;