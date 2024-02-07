import { FC } from "react";
import { Colors } from "../../utils/colors";
import Badge from "./Badge";

interface TagListProps {
    tags: string[];
    onDeletTag: (tag: string) => void;
}

const TagList: FC<TagListProps> = ({ tags, onDeletTag }) => {
    return (
        tags.length > 0 &&
        <span className="flex items-center gap-x-1">
            {tags.map((tag) => (
                <Badge color={Colors.PURPLE} text={tag} key={tag} onDelete={() => onDeletTag(tag)} />
            ))}
        </span>
    );
}

export default TagList;