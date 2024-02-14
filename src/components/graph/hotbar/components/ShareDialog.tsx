import { Transition } from "@headlessui/react";
import { FC, useEffect, useState } from "react";
import {
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from "react-share";

import { XMarkIcon } from "@heroicons/react/20/solid";

import { CheckIcon, LinkIcon, ShareIcon } from "@heroicons/react/24/solid";
import BigButton from "../../../common/BigButton";
import Modal from "../../../common/Modal";
import { logAnalyticsEvent } from "../../../../services/firestore/analytics/analytics";

interface CopyLinkButtonProps {
  onShareUrl: () => void;
}

const CopyLinkButton: FC<CopyLinkButtonProps> = ({ onShareUrl }) => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = () => {
    setIsCopied(true);
    onShareUrl();

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <button
      className="group flex flex-col items-center gap-y-1.5 hover:cursor-pointer"
      onClick={onCopy}
    >
      <div className="h-12 w-12 rounded-full p-1.5  ring-1 ring-gray-300 group-hover:bg-gray-50">
        <Transition
          show={!isCopied}
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="hidden duration-0"
        >
          <LinkIcon className="h-full w-full text-gray-400" />
        </Transition>
        <Transition
          show={isCopied}
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="hidden duration-0"
        >
          <CheckIcon className="h-max w-max text-gray-400" />
        </Transition>
      </div>

      <div className="flex flex-col items-center text-xs text-gray-500">
        {isCopied ? (
          <>
            <p>Copied!</p>
          </>
        ) : (
          <>
            <p>Copy link</p>
          </>
        )}
      </div>
    </button>
  );
};

interface ShareDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  generateSharableLink: () => Promise<string>;
}

const ShareDialog: FC<ShareDialogProps> = ({
  isOpen,
  setIsOpen,
  generateSharableLink,
}) => {
  const closeDialog = () => {
    setIsOpen(false);
  };

  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (isOpen) {
      generateSharableLink().then((url) => {
        setUrl(`${window.location.origin}/graph/${url}`);
        logAnalyticsEvent("share_graph_url_generated", { url });
      });
    }
  }, [isOpen, generateSharableLink]);

  const copyToClipboard = () => {
    if (url) {
      navigator.clipboard.writeText(url);
      logAnalyticsEvent("share_graph_url_copied", { url });
    }
  };

  return (
    <Modal isOpen={isOpen} closeModal={closeDialog}>
      <div className="flex items-center justify-between pb-3">
        <h3 className="flex flex-row items-center gap-x-1.5 text-base font-semibold leading-6 text-gray-900">
          <ShareIcon className="h-7 w-7 text-gray-400" />
          Share graph
        </h3>

        <BigButton
          onClick={closeDialog}
          text="Close"
          Icon={XMarkIcon}
        />
      </div>
      <div className="pt-3">
        <div className="flex flex-row items-center justify-center gap-x-6 divide-x divide-gray-200 text-xs font-semibold text-gray-500">
          <CopyLinkButton onShareUrl={copyToClipboard} />
          <span className="flex flex-row gap-x-6 pl-6">
            <div onClick={() => logAnalyticsEvent("share_graph_linkedin")}>
              <LinkedinShareButton
                url={url || ""}
                className="flex flex-col items-center gap-y-1"
              >
                <LinkedinIcon size={32} round />
                <p>LinkedIn</p>
              </LinkedinShareButton>
            </div>
            <div onClick={() => logAnalyticsEvent("share_graph_twitter")}>
              <TwitterShareButton
                url={url || ""}
                title=""
                hashtags={[]}
                related={[]}
                className="flex flex-col items-center gap-y-1"
              >
                <XIcon size={32} round />
                <p>X</p>
              </TwitterShareButton>
            </div>
            <div onClick={() => logAnalyticsEvent("share_graph_telegram")}>
              <TelegramShareButton
                url={url || ""}
                title=""
                className="flex flex-col items-center gap-y-1"
              >
                <TelegramIcon size={32} round />
                <p>Telegram</p>
              </TelegramShareButton>
            </div>
            <div onClick={() => logAnalyticsEvent("share_graph_whatsapp")}>
              <WhatsappShareButton
                url={url || ""}
                title=""
                className="flex flex-col items-center gap-y-1"
              >
                <WhatsappIcon size={32} round />
                <p>Whatsapp</p>
              </WhatsappShareButton>
            </div>
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default ShareDialog;
