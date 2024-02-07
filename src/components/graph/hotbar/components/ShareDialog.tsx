import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, useState } from "react";
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

import BigButton from "../../../common/BigButton";
import { LinkIcon, CheckIcon, ShareIcon } from "@heroicons/react/24/solid";

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
  shareUrl: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onShareUrl: () => void;
}

const ShareDialog: FC<ShareDialogProps> = ({
  shareUrl,
  isOpen,
  setIsOpen,
  onShareUrl,
}) => {
  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeDialog}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex w-full max-w-md transform flex-col divide-y divide-gray-200 overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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
                      <CopyLinkButton onShareUrl={onShareUrl} />
                      <span className="flex flex-row gap-x-6 pl-6">
                        <LinkedinShareButton
                          url={shareUrl}
                          className="flex flex-col items-center gap-y-1"
                        >
                          <LinkedinIcon size={32} round />
                          <p>LinkedIn</p>
                        </LinkedinShareButton>
                        <TwitterShareButton
                          url={shareUrl}
                          title=""
                          hashtags={[]}
                          related={[]}
                          className="flex flex-col items-center gap-y-1"
                        >
                          <XIcon size={32} round />
                          <p>X</p>
                        </TwitterShareButton>
                        <TelegramShareButton
                          url={shareUrl}
                          title=""
                          className="flex flex-col items-center gap-y-1"
                        >
                          <TelegramIcon size={32} round />
                          <p>Telegram</p>
                        </TelegramShareButton>
                        <WhatsappShareButton
                          url={shareUrl}
                          title=""
                          className="flex flex-col items-center gap-y-1"
                        >
                          <WhatsappIcon size={32} round />
                          <p>Whatsapp</p>
                        </WhatsappShareButton>
                      </span>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ShareDialog;
