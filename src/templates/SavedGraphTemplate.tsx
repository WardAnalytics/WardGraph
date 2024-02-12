import { useParams } from "react-router-dom";
import { FC, useCallback, useEffect, useState } from "react";
import {
  updatePersonalGraph,
  getPersonalGraph,
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
      console.log("Fetched graph:", graph);
      setGraph(graph);
    });
  }, [uid, user]);

  const saveGraph = useCallback(
    (addresses: string[], edges: string[]) => {
      if (!graph) {
        console.error("No graph found for saving");
        return;
      }

      console.log(
        "Attempting to insert {} addresses and {} edges",
        addresses.length,
        edges.length,
      );

      const newGraph = graph;
      newGraph.data.addresses = addresses;
      newGraph.data.edges = edges;

      console.log("Saving a new graph:", newGraph);

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
    />
  );
};

export default SavedGraphTemplate;
