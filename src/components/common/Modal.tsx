import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Dialog } from "@headlessui/react";
import { FC, ReactNode } from "react";
import clsx from "clsx";

type Size = "sm" | "md" | "lg" | "xl" | "fit";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children: ReactNode;
  size?: Size;
  className?: string;
}

/**
 *
 * @param isOpen - Whether the modal is open or not
 * @param closeModal - Function to close the modal
 * @param children - The content of the modal
 * @param size - The size of the modal. The size can be "sm", "md", "lg", "xl", or "fit".
 *
 * sm - "max-w-sm"
 *
 * md - "max-w-md"
 *
 * lg - "max-w-lg"
 *
 * xl - "max-w-xl"
 *
 * The default size is "fit"
 * @param className - Additional classes to be added to the modal
 *
 * @example
 * ```tsx
 * <Modal isOpen={isOpen} closeModal={closeModal} size="md">
 *  <div className="h-fit w-[40rem] bg-white">
 *   <SearchBar onSearchAddress={handleSearchAddress} />
 *  </div>
 * </Modal>
 * ```
 */
const Modal: FC<ModalProps> = ({
  isOpen,
  closeModal,
  children,
  size = "fit",
  className,
}) => {
  const sizeMap: Record<Size, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    fit: "max-w-fit",
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="absolute z-10" onClose={closeModal}>
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
                <Dialog.Panel
                  className={clsx(
                    "z-100 absolute flex w-full transform flex-col rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all",
                    sizeMap[size],
                    className,
                  )}
                >
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
