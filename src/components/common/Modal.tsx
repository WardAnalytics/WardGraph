import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Dialog } from "@headlessui/react";
import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge"
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeButton?: boolean;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  closeModal,
  children,
  size = "md",
  closeButton = true,
}) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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

          <div className="fixed inset-0 flex items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={twMerge("rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-h-3/4 w-3/4 overflow-hidden",
                size === "sm" ? "w-1/2" : size === "md" ? "w-2/3" : size === "lg" ? "w-144" : size === "xl" ? "w-160" : "w-128"
              )}>
                {closeButton &&
                  (
                    <div className="mb-2 flex w-full justify-end">
                      <XMarkIcon
                        className="h-7 w-7 cursor-pointer p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
                        aria-hidden="true"
                        onClick={closeModal}
                      />
                    </div>
                  )
                }
                <div className="overflow-hidden no-scrollbar">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
