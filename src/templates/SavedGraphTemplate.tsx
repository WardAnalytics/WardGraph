import { useParams } from "react-router-dom";
import { FC, useCallback, useEffect, useState } from "react";
import {
  updatePersonalGraph,
  getPersonalGraph,
  PersonalGraphInfo,
} from "../services/firestore/user/graph_saving";

import { Graph } from "../components/graph/Graph";
import { PersonalGraph } from "../services/firestore/user/graph_saving";
import useAuthState from "../hooks/useAuthState";

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
    [graph, user],
  );

  // If no graph has been loaded, don't return anything yet. TODO - Add loading screen
  if (!graph) return null;

  return (
    <Graph
      initialAddresses={graph.data.addresses}
      initialPaths={graph.data.edges}
      onAutoSave={saveGraph}
      key={graph.uid}
    />
  );
};

export default SavedGraphTemplate;
