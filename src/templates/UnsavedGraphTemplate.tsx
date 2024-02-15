import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { SharableGraph, getSharableGraph } from "../services/firestore/graph_sharing";

import { Transition } from "@headlessui/react";
import { Graph } from "../components/graph/Graph";
import LandingPage from "../components/graph/landing_page/LandingPage";

interface UnsavedGraphTemplateProps {
  showLandingPage?: boolean;
}

const UnsavedGraphTemplate: FC<UnsavedGraphTemplateProps> = ({
  showLandingPage = true,
}) => {
  const { uid } = useParams<{ uid: string }>();
  const [loading, setLoading] = useState(true);
  const [graph, setGraph] = useState<SharableGraph>({ addresses: [], edges: [] });

  const initialAddresses = useMemo(() => {
    if (graph) {
      return graph.addresses;
    }

    return [];
  }, [graph]);

  const initialPaths = useMemo(() => {
    if (graph) {
      return graph.edges;
    }

    return [];
  }, [graph]);

  // Save the graph to local storage
  const saveGraph = useCallback(
    (newGraph: SharableGraph) => {
      if (!graph) {
        console.error("No graph found for saving");
        return;
      }

      sessionStorage.setItem("graph", JSON.stringify(newGraph));
    }, [graph])

  useEffect(() => {
    // If there is no uid, it checks the local storage for a graph
    if (!uid) {
      setLoading(false);

      // Check if there is a graph in local storage
      const graph = sessionStorage.getItem("graph");

      // If there is no graph in local storage, default to an empty graph
      if (!graph) {
        console.log(
          "No uid found for fetching graph, defaulting to an empty graph instead.",
        );
        return
      }

      // If there is a graph in local storage, set it as the graph
      setGraph(JSON.parse(graph) as SharableGraph);

      return;
    }

    // If there is a uid, fetch the graph from the database
    getSharableGraph(uid)
      .then((graph) => {
        setGraph(graph)
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching graph", error);
        setLoading(false);
      });
  }, [uid]);

  if (loading) return null;

  return (
    <div className="h-full overflow-hidden">
      <Transition
        show={initialAddresses.length === 0 && showLandingPage}
        appear={true}
        leave="transition-all duration-500"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-50"
        className="absolute flex h-full w-full flex-col items-center justify-center"
      >
        <LandingPage
          setSearchedAddress={(address: string) => {
            setGraph({ addresses: [address], edges: [] });
          }}
        />
      </Transition>
      <Transition
        show={initialAddresses.length > 0 || !showLandingPage}
        appear={true}
        enter="transition-all duration-500 delay-500"
        enterFrom="opacity-0 scale-150"
        enterTo="opacity-100 scale-100"
        className="h-full w-full"
      >
        <Graph
          initialAddresses={initialAddresses}
          initialPaths={initialPaths}
          onLocalSave={saveGraph}
        />
      </Transition>
    </div>
  );
};

export default UnsavedGraphTemplate;
