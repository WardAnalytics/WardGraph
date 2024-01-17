import { Dialog, Transition } from '@headlessui/react';
import { FC, Fragment } from 'react';
import {
    LinkedinIcon,
    LinkedinShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    XIcon
} from 'react-share';

import clsx from "clsx";
import CopyToClipboardIcon from '../AnalysisWindow/Header/components/CopyToClipboardIcon';

interface CopyLinkBarProps {
    shareUrl: string
}

const CopyLinkBar: FC<CopyLinkBarProps> = ({ shareUrl }) => {
    return (
        <div className={clsx("flex rounded-md shadow-sm")}>
            <div className="relative flex flex-grow items-stretch focus-within:z-10">
                <input
                    type="text"
                    name="address"
                    id="address"
                    value={shareUrl}
                    readOnly={true}
                    className={
                        "block w-full rounded-none rounded-l-md border-0 py-1.5 font-mono text-gray-500 ring-1 ring-inset ring-gray-300 transition-all text-xs sm:leading-6 focus:outline-none focus:ring-gray-300 focus:border-gray-500"}
                />
            </div>

            <button
                type="button"
                className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 text"
            >
                <CopyToClipboardIcon textToCopy={shareUrl} />
            </button>
        </div>
    );
};

interface ShareDialogProps {
    shareUrl: string
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    onShareUrl: () => void
}

const ShareDialog: FC<ShareDialogProps> = ({
    shareUrl,
    isOpen,
    setIsOpen,
    onShareUrl
}) => {
    const closeDialog = () => {
        setIsOpen(false)
    }

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
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <div className='flex justify-between items-center'>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-800"
                                        >
                                            Share graph
                                        </Dialog.Title>
                                        <button
                                            type='button'
                                            className="text-sm font-bold leading-6 text-gray-500"
                                            onClick={closeDialog}
                                        >
                                            X
                                        </button>
                                    </div>
                                    <div className="mt-8">
                                        <div className='flex justify-center gap-x-6 text-xs text-gray-500'>
                                            <LinkedinShareButton
                                                url={shareUrl}
                                                className='flex flex-col items-center gap-y-1'
                                            >
                                                <LinkedinIcon size={32} round />
                                                <p>LinkedIn</p>
                                            </LinkedinShareButton>
                                            <TwitterShareButton
                                                url={shareUrl}
                                                title=''
                                                hashtags={[]}
                                                related={[]}
                                                className='flex flex-col items-center gap-y-1'
                                            >
                                                <XIcon size={32} round />
                                                <p>X</p>
                                            </TwitterShareButton>
                                            <TelegramShareButton
                                                url={shareUrl}
                                                title=''
                                                className='flex flex-col items-center gap-y-1'
                                            >
                                                <TelegramIcon size={32} round />
                                                <p>Telegram</p>
                                            </TelegramShareButton>
                                            <WhatsappShareButton
                                                url={shareUrl}
                                                title=''
                                                className='flex flex-col items-center gap-y-1'
                                            >
                                                <WhatsappIcon size={32} round />
                                                <p>Whatsapp</p>
                                            </WhatsappShareButton>

                                        </div>
                                        <div className='mt-8'>
                                            <CopyLinkBar shareUrl={shareUrl} />
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition >
        </>
    )
}

export default ShareDialog