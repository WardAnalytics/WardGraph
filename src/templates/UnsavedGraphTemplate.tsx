import { useParams } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import { getSharableGraph } from "../services/firestore/graph_sharing";

import { Graph } from "../components/graph/Graph";
import LandingPage from "../components/graph/landing_page/LandingPage";
import { Transition } from "@headlessui/react";

interface UnsavedGraphTemplateProps {
  showLandingPage?: boolean;
}

const UnsavedGraphTemplate: FC<UnsavedGraphTemplateProps> = ({
  showLandingPage = true,
}) => {
  const { uid } = useParams<{ uid: string }>();
  const [initialAddresses, setInitialAddresses] = useState<string[]>([]);
  const [initialPaths, setInitialPaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(uid ? true : false);

  useEffect(() => {
    if (!uid) {
      console.log(
        "No uid found for fetching graph, defaulting to an empty graph instead.",
      );
      setLoading(false);
      return;
    }

    getSharableGraph(uid)
      .then((graph) => {
        setInitialAddresses(graph.addresses);
        setInitialPaths(graph.edges);
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
            setInitialAddresses([address]);
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
        />
      </Transition>
    </div>
  );
};

export default UnsavedGraphTemplate;
