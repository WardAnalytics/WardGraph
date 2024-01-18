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

import { FaLink } from "react-icons/fa";

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
                                            <button className='flex flex-col items-center gap-y-1 hover:cursor-pointer' onClick={onShareUrl}>
                                                <FaLink size={32} className='border border-gray-300 rounded-full p-2' />
                                                <div className='flex flex-col items-center'>
                                                    <p>Copy</p>
                                                    <p>Link</p>
                                                </div>
                                            </button>
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