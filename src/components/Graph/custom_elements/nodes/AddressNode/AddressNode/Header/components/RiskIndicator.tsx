import { FC } from "react";
import { ColorMap, Colors } from "../../../../../../../../utils/colors";
import LoadingCircle from "../../../../../../../common/LoadingCircle";
import clsx from "clsx";

interface RiskIndicatorProps {
  isLoading: boolean;
  risk?: number;
}

/** Displays a risk indicator badge.
 * @param isLoading: whether the risk is still loading
 * @param risk: the risk to display
 */

const RiskIndicator: FC<RiskIndicatorProps> = ({
  isLoading,
  risk,
}: RiskIndicatorProps) => {
  let color = Colors.GRAY;
  let displayedRisk = "";

  if (risk !== undefined) {
    color = Colors.GREEN;

    if (risk > 2) {
      color = Colors.YELLOW;
    }
    if (risk > 5) {
      color = Colors.ORANGE;
    }
    if (risk > 8) {
      color = Colors.RED;
    }

    displayedRisk = (Math.round(risk * 10) / 10).toString();
  }

  const { text, background, ring } = ColorMap[color];

  return (
    <span
      className={clsx(
        "text-s mx-auto my-1 flex h-9 w-9 items-center justify-center rounded-md font-semibold ring-1",
        text,
        background,
        ring,
      )}
    >
      {isLoading ? <LoadingCircle /> : displayedRisk}
    </span>
  );
};

export default RiskIndicator;
