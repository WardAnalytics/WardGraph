import { ClipboardIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";

interface CopyToClipboardIconProps {
  textToCopy: string;
}

/** This component is an icon that copies a piece of text to the clipboard.
 * It uses the navigator.clipboard API to copy the text to the clipboard.
 *
 * @param textToCopy: The text to copy
 */

const CopyToClipboardIcon: FC<CopyToClipboardIconProps> = ({ textToCopy }) => {
  // Function for copying text to the clipboard
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <ClipboardIcon
      className={`h-5 w-5 cursor-pointer transition-all duration-200 ${isCopied ? "text-blue-500" : "text-gray-400 hover:text-gray-500"
        }`}
      aria-hidden="true"
      onClick={copyToClipboard}
    />
  );
};

export default CopyToClipboardIcon;
