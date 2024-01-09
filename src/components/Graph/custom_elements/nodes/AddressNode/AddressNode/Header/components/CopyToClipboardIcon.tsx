import { FC, useState } from "react";
import { ClipboardIcon } from "@heroicons/react/24/outline";

interface CopyToClipboardIconProps {
  address: string;
}

/** This component is an icon that copies the address to the clipboard.
 * It uses the navigator.clipboard API to copy the address to the clipboard.
 *
 * @param address: The address to copy
 */

const CopyToClipboardIcon: FC<CopyToClipboardIconProps> = ({ address }) => {
  // Function for copying the address to the clipboard
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <ClipboardIcon
      className={`h-5 w-5 cursor-pointer transition-all duration-200 ${
        isCopied ? "text-blue-500" : "text-gray-400 hover:text-gray-500"
      }`}
      aria-hidden="true"
      onClick={copyToClipboard}
    />
  );
};

export default CopyToClipboardIcon;
