import { XMarkIcon } from "@heroicons/react/24/outline";
import { FC, useCallback } from "react";
import useAuthState from "../../hooks/useAuthState";
import { removePersonalGraph } from "../../services/firestore/user/graph_saving";

import { TrashIcon } from "@heroicons/react/20/solid";
import Modal from "./Modal";

interface DeleteGraphDialogProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  graphUID: string;
}

const DeleteGraphDialog: FC<DeleteGraphDialogProps> = ({
  isOpen,
  setOpen,
  graphUID,
}) => {
  const { user } = useAuthState();
  const closeDialog = () => {
    setOpen(false);
  };

  const deleteGraph = useCallback(async () => {
    if (!user) {
      throw new Error("No user found for deleting graph");
    }

    removePersonalGraph(user.uid, graphUID).then(() => {
      setOpen(false);
    });
  }, [graphUID]);

  return (
    <Modal isOpen={isOpen} closeModal={closeDialog} size="md">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h3 className="flex flex-row items-center gap-x-1.5 text-lg font-semibold leading-6 text-gray-900">
          Delete graph
        </h3>

        <XMarkIcon
          className="h-11 w-11 cursor-pointer rounded-full p-1.5 text-gray-400 transition-all duration-300 hover:bg-gray-100"
          aria-hidden="true"
          onClick={closeDialog}
        />
      </div>
      <span className="mt-3 flex flex-row gap-x-2">
        <button
          type="button"
          onClick={deleteGraph}
          className="flex w-full flex-row items-center justify-center gap-x-1.5 rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <TrashIcon className="h-5 w-5  text-white" aria-hidden="true" />
          Delete graph
        </button>
      </span>
    </Modal>
  );
};

export default DeleteGraphDialog;
