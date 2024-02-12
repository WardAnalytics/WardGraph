import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  createPersonalGraph,
  PersonalGraph,
  PersonalGraphInfo,
} from "../../services/firestore/user/graph_saving";
import { FC, Fragment, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthState from "../../hooks/useAuthState";

import BigButton from "./BigButton";
import { BookmarkIcon } from "@heroicons/react/20/solid";

interface CreateGraphDialogProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  graphInfo?: PersonalGraphInfo;
}

const CreateGraphDialog: FC<CreateGraphDialogProps> = ({
  isOpen,
  setOpen,
  graphInfo,
}) => {
  const navigate = useNavigate();
  const { user } = useAuthState();
  const closeDialog = () => {
    setOpen(false);
  };
  const [graphName, setGraphName] = useState<string>("");

  const createGraph = useCallback(async () => {
    if (!user) {
      throw new Error("No user found for creating graph");
    }
    const graph: PersonalGraph = {
      name: graphName,
      data: graphInfo || {
        addresses: [],
        edges: [],
        tags: [],
        averageRisk: 0,
        totalVolume: 0,
      },
    };
    createPersonalGraph(user.uid, graph).then((uid) => {
      setOpen(false);
      navigate(`/saved-graph/${uid}`);
    });
  }, [graphName]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeDialog}>
          {/** Black background */}
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

          {/** Dialog */}
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
                <Dialog.Panel className="flex w-full max-w-md transform flex-col overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <h3 className="flex flex-row items-center gap-x-1.5 text-lg font-semibold leading-6 text-gray-900">
                      Create a new graph
                    </h3>

                    <XMarkIcon
                      className="h-11 w-11 cursor-pointer rounded-full p-1.5 text-gray-400 transition-all duration-300 hover:bg-gray-100"
                      aria-hidden="true"
                      onClick={closeDialog}
                    />
                  </div>
                  <span className="mt-3 flex flex-row gap-x-2">
                    {/** Graph name input and button to create. Either clicking the button or pressing enter will create the graph and navigate to the saved graph page */}
                    <input
                      type="text"
                      value={graphName}
                      onChange={(e) => setGraphName(e.target.value)}
                      placeholder="Graph name"
                      className="w-full rounded-md border-0 px-3 text-sm font-semibold leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 transition-all placeholder:text-gray-400 focus:outline focus:outline-[3px] focus:outline-blue-200 focus:ring-2 focus:ring-blue-400"
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          createGraph();
                        }
                      }}
                    />
                    <BigButton
                      onClick={createGraph}
                      Icon={BookmarkIcon}
                      text="Create"
                    />
                  </span>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CreateGraphDialog;
