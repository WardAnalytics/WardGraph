import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { InboxIcon } from '@heroicons/react/24/outline'
import { FC, Fragment, useState } from 'react'
import Tutorial from './Tutorial'

const TutorialPopup: FC = () => {
    const [show, setShow] = useState(true)
    const [showTutorial, setShowTutorial] = useState(false);

    const tutorialSteps = [
        {
            title: "Welcome to Ward!",
            description:
                "Ward is a decentralized social media platform that allows you to connect with your friends and favorite creators.",
            image: "https://picsum.photos/200/300"
        },
        {
            title: "Connect your wallet",
            description:
                "Ward is a decentralized social media platform that allows you to connect with your friends and favorite creators.",
            image: "https://picsum.photos/200/300"
        },
        {
            title: "Search for your friends",
            description:
                "Ward is a decentralized social media platform that allows you to connect with your friends and favorite creators.",
            image: "https://picsum.photos/200/300"
        },
        {
            title: "Follow your favorite creators",
            description:
                "Ward is a decentralized social media platform that allows you to connect with your friends and favorite creators.",
            image: "https://picsum.photos/200/300"
        }
    ];


    return (
        <>
            {/* Global notification live region, render this permanently at the end of the document */}
            <div
                aria-live="assertive"
                className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
            >
                <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                    {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
                    <Transition
                        show={show}
                        as={Fragment}
                        enter="transform ease-out duration-300 transition"
                        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <InboxIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3 w-0 flex-1 pt-0.5">
                                        <p className="text-sm font-medium text-gray-900">Need help?</p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Visit our tutorial to learn how to use the graph.
                                        </p>
                                        <div className="mt-3 flex space-x-7">
                                            <button
                                                type="button"
                                                className="rounded-md bg-white text-sm font-medium text-blue-500 hover:text-blue-400 focus:outline-none "
                                                onClick={() => {
                                                    setShowTutorial(true)
                                                    setShow(false)
                                                }}
                                            >
                                                Tutorial
                                            </button>
                                            <button
                                                type="button"
                                                className="rounded-md bg-white text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                onClick={() => {
                                                    setShow(false)
                                                }
                                                }
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex flex-shrink-0">
                                        <button
                                            type="button"
                                            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            onClick={() => {
                                                setShow(false)
                                            }}
                                        >
                                            <span className="sr-only">Close</span>
                                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div >
            </div >
            <Tutorial show={showTutorial} setShow={setShowTutorial} steps={tutorialSteps} />
        </>
    )
}

export default TutorialPopup