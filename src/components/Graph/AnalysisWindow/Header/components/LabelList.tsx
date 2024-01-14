import { FC } from "react";

import Badge from "../../../../common/Badge";
import { Colors } from "../../../../../utils/colors";

interface LabelListProps {
  labels: string[];
}

/** This component is a list of labels using Badges.
 *
 * @param labels: The labels to display
 */

// List of labels using Badges
const LabelList: FC<LabelListProps> = ({ labels }) => {
  return (
    <span className="flex items-center gap-x-1">
      {labels.map((label) => (
        <Badge color={Colors.BLUE} text={label} key={label} />
      ))}
    </span>
  );
};

export default LabelList;
