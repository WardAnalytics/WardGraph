import { FC, useState } from "react";
import { ShareIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/16/solid";
import {
  usePersonalGraphs,
  createPersonalGraph,
  PersonalGraph,
  PersonalGraphInfo,
  removePersonalGraph,
} from "../services/firestore/user/graph_saving";
import useAuthState from "../hooks/useAuthState";

function createEmtpyGraph(name: string): PersonalGraph {
  const graphInfo: PersonalGraphInfo = {
    addresses: [],
    edges: [],
    tags: [],
    averageRisk: 0,
    totalVolume: 0,
  };

  const graph: PersonalGraph = {
    name,
    data: graphInfo,
  };

  return graph;
}

const SavedGraphsTemplate: FC = () => {
  const { user } = useAuthState();
  const { graphs } = usePersonalGraphs(user ? user.uid : "");
  const [graphName, setGraphName] = useState<string>("");

  return (
    <div className="mx-14 my-10 flex w-full flex-col gap-y-5">
      <h3 className="flex flex-row gap-x-2 text-xl font-semibold text-gray-700">
        <ShareIcon className="mt-0.5 inline-block h-7 w-7 text-gray-400" />
        Saved Graphs
      </h3>
      <div className="h-[1px] w-full bg-gray-200" />
      <input
        type="text"
        placeholder="Graph Name"
        value={graphName}
        onChange={(e) => setGraphName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && user) {
            createPersonalGraph(user.uid, createEmtpyGraph(graphName));
            setGraphName("");
          }
        }}
      />
      <ul>
        {graphs.map((graph) => (
          <li
            key={graph.uid!}
            className="text-semibold mb-5 flex flex-row gap-x-2 text-lg text-gray-800"
          >
            {graph.name}
            <XMarkIcon
              className="h-7 w-7 cursor-pointer text-gray-500"
              onClick={() => {
                if (user) removePersonalGraph(user.uid, graph.uid!);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedGraphsTemplate;
