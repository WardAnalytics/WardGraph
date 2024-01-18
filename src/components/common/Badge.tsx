import clsx from "clsx";
import { Colors, ColorMap } from "../../utils/colors";

interface BadgeProps {
  color: Colors;
  text: string;
  Icon?: any;
}

/** This component is a badge that displays a text and a color.
 *
 * @param text: The text of the badge
 * @param color: The color of the badge
 * @param Icon: The icon of the badge
 */

export default function Badge({ color, text, Icon }: BadgeProps) {
  const { text: textColor, background, ring } = ColorMap[color];

  return (
    <span
      className={clsx(
        "inline-flex items-center space-x-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        textColor,
        background,
        ring,
      )}
    >
      {Icon && <Icon className={`mr-0.5 h-3 w-3 ${textColor}`} />}
      {text}
    </span>
  );
}
