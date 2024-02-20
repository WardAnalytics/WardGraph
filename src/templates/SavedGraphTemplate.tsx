import { FC, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  PersonalGraphInfo,
  getPersonalGraph,
  updatePersonalGraph,
} from "../services/firestore/user/graph_saving";

import { Graph } from "../components/graph/Graph";
import useAuthState from "../hooks/useAuthState";
import { PersonalGraph } from "../services/firestore/user/graph_saving";
import { Transition } from "@headlessui/react";
import SavedGraphBanner from "../components/banner/SavedGraphBanner";

const SavedGraphTemplate: FC = () => {
  const { user } = useAuthState();
  const { uid } = useParams<{ uid: string }>();
  const [graph, setGraph] = useState<PersonalGraph | null>(null);

  useEffect(() => {
    if (!user) {
      console.error("No user found for fetching graph {}", uid);
      return;
    }
    if (!uid) {
      console.error("No uid found for fetching graph");
      return;
    }

    getPersonalGraph(user.uid, uid).then((graph) => {
      setGraph(graph);
    });
  }, [uid, user]);

  const saveGraph = useCallback(
    (graphInfo: PersonalGraphInfo) => {
      if (!graph) {
        console.error("No graph found for saving");
        return;
      }

      const newGraph = graph;
      newGraph.data = graphInfo;

      updatePersonalGraph(user!.uid, newGraph);
    },
    [graph, user]
  );

  // If no graph has been loaded, don't return anything yet. TODO - Add loading screen
  if (!graph) return null;

  return (
    <div className="h-full overflow-hidden">
      {/* Must leave the transition because somehow it messes the opacity of the modals */}
      <Transition
        show={graph !== null}
        appear={true}
        enter="transition-all duration-500 delay-500"
        enterFrom="opacity-0 scale-150"
        enterTo="opacity-100 scale-100"
        className="h-full w-full"
      >
        <SavedGraphBanner />
        <Graph
          initialAddresses={graph.data.addresses}
          initialPaths={graph.data.edges}
          onAutoSave={saveGraph}
          key={graph.uid}
        />
      </Transition>
    </div>
  );
};

export default SavedGraphTemplate;
