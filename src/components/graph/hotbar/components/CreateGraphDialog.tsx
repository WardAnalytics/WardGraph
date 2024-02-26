import { XMarkIcon } from "@heroicons/react/24/outline";
import { FC, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthState from "../../../../hooks/useAuthState";
import {
  PersonalGraph,
  PersonalGraphInfo,
  createPersonalGraph,
} from "../../../../services/firestore/user/graph_saving";

import { BookmarkIcon } from "@heroicons/react/20/solid";
import { logAnalyticsEvent } from "../../../../services/firestore/analytics/analytics";
import BigButton from "../../../common/BigButton";
import Modal from "../../../common/Modal";

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

  const createGraph = useCallback(() => {

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
    createPersonalGraph(user!.uid, graph).then((uid) => {
      logAnalyticsEvent("graph_created", { graphName });
      setOpen(false);
      navigate(`/${user?.uid}/saved-graph/${uid}`);
    });
  }, [graphName]);

  return (
    <Modal isOpen={isOpen} closeModal={closeDialog} size="md">
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
              logAnalyticsEvent("graph_created_enter_key_pressed", { graphName });
            }
          }}
        />
        <BigButton onClick={createGraph} Icon={BookmarkIcon} text="Create" />
      </span>
    </Modal>
  );
};

export default CreateGraphDialog;
