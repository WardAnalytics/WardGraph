import { LinkIcon } from "@heroicons/react/16/solid";
import {
  ArrowTopRightOnSquareIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { FC, KeyboardEvent, useState } from "react";
import Badge from "../components/common/Badge";
import useAuthState from "../hooks/useAuthState";
import {
  PersonalGraph,
  updatePersonalGraph,
  usePersonalGraphs,
} from "../services/firestore/user/graph_saving";
import { Colors } from "../utils/colors";

import { PlusCircleIcon } from "@heroicons/react/20/solid";

import { useNavigate } from "react-router-dom";
import BigButton from "../components/common/BigButton";
import CreateGraphDialog from "../components/common/CreateGraphDialog";
import DeleteGraphDialog from "../components/common/DeleteGraphDialog";
import SEO from "../components/common/SEO";
import "../components/common/Scrollbar.css";
import { HotKeysType } from "../types/hotKeys";

interface GraphCardProps {
  userID: string;
  graph: PersonalGraph;
}

const GraphCard: FC<GraphCardProps> = ({ userID, graph }) => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [graphName, setGraphName] = useState<string>(graph.name);
  const [editMode, setEditMode] = useState<boolean>(false);

  const onChangeGraphName = async () => {
    graph.name = graphName;
    await updatePersonalGraph(userID, graph);
    setEditMode(false);
  };

  // Hotkeys for the graph name input
  // Enter: Save the graph name
  const hotKeysMap: HotKeysType = {
    ENTER: {
      key: "enter",
      asyncHandler: async (event: KeyboardEvent<HTMLElement>) => {
        event.preventDefault();

        await onChangeGraphName();
      },
    },
  };

  return (
    <div className="group flex h-full min-h-[7rem] w-full flex-col gap-2 rounded-md px-4 py-3 text-lg text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300">
      <p className=" flex h-fit flex-row flex-wrap items-center gap-1.5 text-base font-semibold text-gray-800 transition-all duration-150 ">
        {editMode ? (
          <div className="flex w-full flex-row items-center gap-1.5 group-hover:flex">
            <input
              type="text"
              value={graphName}
              onChange={(e) => setGraphName(e.target.value)}
              autoFocus
              className="block w-full rounded-md border-0 py-1.5 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 transition-all placeholder:text-gray-400 focus:outline focus:outline-[3px] focus:outline-blue-200 focus:ring-2 focus:ring-blue-400"
              onKeyDown={async (event) => {
                const hotKey = event.key.toLocaleLowerCase();
                switch (hotKey) {
                  case hotKeysMap.ENTER.key:
                    await hotKeysMap.ENTER.asyncHandler!(event);
                    break;
                }
              }}
              onBlur={onChangeGraphName}
            />
          </div>
        ) : (
          <span onClick={() => setEditMode(true)}>{graph.name}</span>
        )}
        <Badge text="Ethereum" color={Colors.BLUE} Icon={LinkIcon} />
      </p>

      <div className="h-[1.5px] w-full bg-gray-100" />
      <p className="text-sm text-gray-600">
        {graph.data.addresses.length} addresses
      </p>
      <div className="ml-auto mt-auto flex flex-row">
        <TrashIcon
          className="z-10 h-8 w-8 cursor-pointer rounded-md p-1.5 text-gray-400 transition-all duration-150 hover:bg-red-100 hover:text-red-500"
          onClick={() => setIsDeleteDialogOpen(true)}
        />
        <ArrowTopRightOnSquareIcon
          className="z-10 h-8 w-8 cursor-pointer rounded-md p-1.5 text-gray-400 transition-all duration-150 hover:bg-gray-100 hover:text-gray-500"
          onClick={() => navigate(`/${userID}/saved-graph/${graph.uid}`)}
        />
      </div>
      <DeleteGraphDialog
        isOpen={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        graphUID={graph.uid!}
      />
    </div>
  );
};

const SavedGraphsTemplate: FC = () => {
  const { userID } = useAuthState();
  const { graphs } = usePersonalGraphs(userID);
  const [isCreateGraphDialogOpen, setIsCreateGraphDialogOpen] = useState(false);

  return (
    <>
      <SEO
        title="Saved Graphs"
        description="View and manage your saved graphs"
      />
      <div className="mx-14 my-10 flex w-full flex-col gap-y-5">
        <h3 className="flex flex-row justify-between  text-xl font-semibold text-gray-700">
          <div className="flex flex-row items-center gap-2">
            <ShareIcon className="mt-0.5 inline-block h-7 w-7 text-gray-400" />
            Saved Graphs
          </div>
          <BigButton
            text="New graph"
            onClick={() => {
              setIsCreateGraphDialogOpen(true);
            }}
            Icon={PlusCircleIcon}
          />
        </h3>
        <div className="h-[1px] w-full bg-gray-200" />
        <div className="scrollbar overflow-x-hidden overflow-y-scroll">
          <div className="grid auto-rows-auto grid-cols-3 gap-4 pr-3">
            {graphs.map((graph) => (
              <GraphCard graph={graph} key={graph.uid} userID={userID} />
            ))}
          </div>
        </div>
        <CreateGraphDialog
          isOpen={isCreateGraphDialogOpen}
          setOpen={setIsCreateGraphDialogOpen}
        />
      </div>
    </>
  );
};

export default SavedGraphsTemplate;
