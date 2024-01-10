import { FC } from "react";

interface ButtonProps {
  onClick: () => void;
  text: string;
  Icon: any;
}

/**
 * @description Button component. Takes text, an icon, and an onClick function.
 * @param onClick The function to call when the button is clicked
 * @param text The text to display on the button
 * @param Icon The icon to display on the button
 */

const BigButton: FC<ButtonProps> = ({ onClick, text, Icon }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
    >
      <Icon
        className="h-5 w-5 rounded-full  text-gray-400"
        aria-hidden="true"
      />
      {text}
    </button>
  );
};

export default BigButton;
