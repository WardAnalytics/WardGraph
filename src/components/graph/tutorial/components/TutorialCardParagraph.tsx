import { FC } from "react";

interface TutorialCardParagraphProps {
    text: string;
}

const TutorialCardParagraph: FC<TutorialCardParagraphProps> = ({
    text
}) => {
    return (
        <p className="text-sm text-gray-600">
            {text}
        </p>
    );
}

export default TutorialCardParagraph;