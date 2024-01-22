import { Transition } from "@headlessui/react";
import {
  FC,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  Panel,
  ReactFlowProvider,
  SelectionMode,
  useEdgesState,
  useNodesState,
  useOnSelectionChange,
  useReactFlow,
  useUpdateNodeInternals,
} from "reactflow";
import "reactflow/dist/style.css";

import { AddressAnalysis } from "../../api/model";

import {
  TransfershipEdge,
  TransfershipEdgeStates,
} from "./custom_elements/edges/TransfershipEdge";
import {
  AddressNode,
  AddressNodeState,
  createAddressNode,
} from "./custom_elements/nodes/AddressNode";

import {
  calculateAddTransfershipEdges,
  calculateLayoutedElements,
  calculateNewAddressPath,
  convertEdgeListToRecord,
  convertNodeListToRecord,
} from "./graph_calculations";

import analytics from "../../firebase/analytics";
import firestore, { StoreUrlObject } from "../../firebase/firestore";
import generateShortUrl from "../../utils/generateShortUrl";
import TutorialPopup from "../tutorial/TutorialPopup";
import DraggableWindow from "./AnalysisWindow/AnalysisWindow";
import Hotbar from "./Hotbar";
import LandingPage from "./LandingPage/LandingPage";
import Legend from "./Legend";
import TransactionTooltip, {
  TransactionTooltipProps,
} from "./TransactionTooltip";


/* Pan on drag settings */
const panOnDrag = [1, 2];

/* Custom Nodes & Edges */
const nodeTypes = { AddressNode: AddressNode };
const edgeTypes = { TransfershipEdge: TransfershipEdge };

/* Context for variable handling */
interface GraphContextProps {
  addAddressPaths: (
    paths: string[][],
    incoming: boolean,
    volume: number,
  ) => void;
  addEdges: (newEdges: Edge[]) => void;
  setEdgeState: (edgeID: string, state: TransfershipEdgeStates) => void;
  getEdgeVolumeScale: (volume: number) => number;
  getEdgeHandleID: (edgeID: string) => string;
  setFocusedAddressData: (data: AddressAnalysis | null) => void;
  setHoveredTransferData: (data: TransactionTooltipProps | null) => void;
  getSharingLink: () => string;
  copyLink: (url: string) => void;
  doLayout: () => void;
  setNodeHighlight: (address: string, highlight: boolean) => void;
  getNodeCount: () => number;
  setShowTutorial: (show: boolean) => void;
  focusedAddressData: AddressAnalysis | null;
}

export const GraphContext = createContext<GraphContextProps>(
  {} as GraphContextProps,
);

/* The ReactFlowProvider must be above the GraphProvided component in the tree for ReactFlow's internal context to work
   Reference: https://reactflow.dev/api-reference/react-flow-provider#notes */
interface GraphProviderProps {
  initialAddresses: string[];
  initialPaths: string[];
}

/** GraphProvider simply wraps the ReactFlowProvider and provides the initial nodes
 * for the graph to start. This is required due to the way ReactFlow works.
 * @param initialAddresses the addresses to start the graph with
 * @returns
 */

const GraphProvider: FC<GraphProviderProps> = ({
  initialAddresses,
  initialPaths,
}) => {
  // Grab all initial addresses and create nodes for them
  const initialNodes = useMemo(() => {
    const nodes: Node[] = [];
    initialAddresses.forEach((address) => {
      nodes.push(
        createAddressNode(address, AddressNodeState.MINIMIZED, true, 0, 0),
      );
    });
    return nodes;
  }, [initialAddresses]);

  const initialEdges = useMemo(() => {
    const edges: Edge[] = [];
    initialPaths.forEach((path) => {
      const [source, target] = path.split("-");
      if (source && target) {
        edges.push({
          id: `${source}-${target}`,
          source: source,
          target: target,
          sourceHandle: "a",
          targetHandle: "a",
          type: "TransfershipEdge",
          data: {
            state: TransfershipEdgeStates.REVEALED,
            volume: 0,
          },
        });
      }
    });
    return edges;
  }, [initialPaths]);

  // We make sure to calculate the layouted nodes and edges before rendering
  return (
    <>
      <div style={{ height: "100%" }}>
        <ReactFlowProvider>
          <GraphProvided
            initialNodes={calculateLayoutedElements(initialNodes, initialEdges)}
            initialEdges={initialEdges}
          />
        </ReactFlowProvider>
      </div>
    </>
  );
};

interface GraphProvidedProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

/** GraphProvided is the main component that renders the graph and handles
 * most logic. It is wrapped by GraphProvider for the ReactFlowProvider.
 * @param initialNodes the initial nodes to start the graph with
 */
const GraphProvided: FC<GraphProvidedProps> = ({
  initialNodes,
  initialEdges,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { fitView } = useReactFlow();

  // Regularly update the node internals to make sure edges are consistent
  const updateNodeInternals = useUpdateNodeInternals();
  const prevNodeWidths = useRef<Map<string, number | null | undefined>>(
    new Map(),
  );
  useEffect(() => {
    nodes.forEach((node) => {
      if (prevNodeWidths.current.get(node.id) !== node.width) {
        prevNodeWidths.current.set(node.id, node.width);
        updateNodeInternals(node.id);
      }
    });
  }, [nodes]);

  // For the first 3 seconds after mounting, we want to updateNodeInternals for all nodes every 100ms
  const [firstUpdate, setFirstUpdate] = useState<boolean>(true);
  useEffect(() => {
    if (firstUpdate) {
      const interval = setInterval(() => {
        nodes.forEach((node) => {
          updateNodeInternals(node.id);
        });
      }, 100);
      setTimeout(() => {
        clearInterval(interval);
        setFirstUpdate(false);
      }, 10000);
    }
  }, [firstUpdate]);

  // Record Optimization -------------------------------------------------------

  /* For performance reasons, we store the edges and nodes
   * in a ref so lookups are O(1) instead of O(n) */
  const { nodesRecord } = useMemo(() => {
    return {
      nodesRecord: convertNodeListToRecord(nodes),
    };
  }, [nodes]);
  const { edgesRecord } = useMemo(() => {
    return {
      edgesRecord: convertEdgeListToRecord(edges),
    };
  }, [edges]);

  // Dynamic Edge Handles ------------------------------------------------------

  /* We want the edge handles to change dynamically depending on the position
   * of their source and target. Whenever a node's position changes:
   * - Get all the edges connected to that node
   * - Based on the node's position and the other node's position,
   * re-recalculate the handle type for the edge to connect to (A or B) */
  const prevNodePositions = useRef<Map<string, number>>(new Map());
  useEffect(() => {
    // New edges to be set
    const newEdgesRecord = edgesRecord;
    let updateEdges: boolean = false;
    let updateNodeRefs: boolean = false;

    nodes.forEach((node) => {
      const prevPos = prevNodePositions.current.get(node.id);
      if (prevPos !== node.position.x) {
        updateNodeRefs = true;

        // Get all the edges that are connected to this node
        const connectedEdges: Edge[] = edges.filter(
          (edge) => edge.source === node.id || edge.target === node.id,
        );

        // For each edge, compare the source and target position node center X
        for (const edge of connectedEdges) {
          // Get the source and target nodes
          const sourceNode = nodesRecord[edge.source];
          const targetNode = nodesRecord[edge.target];

          if (!sourceNode || !targetNode) continue;

          // If the source node is to the right of the target node, the edge should flow from the right of the source node to the left of the target node
          const newHandleType =
            sourceNode.position.x > targetNode.position.x ? "b" : "a";

          // Compare the new handle type to the old handle type
          if (newHandleType !== edge.sourceHandle) {
            updateEdges = true;
            const newEdge: Edge = {
              ...edge,
              sourceHandle: newHandleType,
              targetHandle: newHandleType,
            };

            // Update the record
            newEdgesRecord[edge.id] = newEdge;
          }
        }
      }
    });

    if (updateNodeRefs) {
      if (updateEdges) setEdges(Object.values(newEdgesRecord));
      const newPositions = new Map(prevNodePositions.current);
      nodes.forEach((node) => {
        newPositions.set(node.id, node.position.x);
      });
      prevNodePositions.current = newPositions;
    }
  }, [nodes]);

  function getEdgeHandleID(edgeID: string): string {
    const edge = edgesRecord[edgeID];

    if (edge && edge.sourceHandle) {
      return edge.sourceHandle;
    }

    return "";
  }

  // Dynamic Edge Weighting ---------------------------------------------------

  /* Edges each have a volume associated and we want to scale their width
   * based on that. As such, we grade them on a curve similar to university
   * grading curves. */
  const { meanVolume, volumeStandardDeviation } = useMemo(() => {
    let totalVolume = 0;
    let totalVariance = 0;

    edges.forEach((edge) => {
      if (
        edge.data.state === TransfershipEdgeStates.REVEALED &&
        (nodesRecord[edge.source] || nodesRecord[edge.target])
      ) {
        const volume: number = edge.data.volume;
        totalVolume += volume;
        totalVariance += Math.pow(volume, 2);
      }
    });

    // Calculate the mean and standard deviation
    const meanVolume = totalVolume / edges.length;
    const volumeStandardDeviation = Math.sqrt(totalVariance / edges.length);

    return {
      meanVolume: meanVolume || 1,
      volumeStandardDeviation: volumeStandardDeviation || 1,
    };
  }, [edges]);

  /** Returns the scaled volume of an edge between 0 and 1
   * @param volume the volume of the edge
   * @returns the scaled volume of the edge
   */
  const getEdgeVolumeScale = useCallback(
    (volume: number): number => {
      return Math.min(
        Math.max((volume - meanVolume) / volumeStandardDeviation, 0),
        1,
      );
    },
    [edges],
  );

  // Mass Selection and deletion logic ----------------------------------------

  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  /** Updates selected nodes whenever a new selection is made */
  useOnSelectionChange({
    onChange: ({ nodes }) => {
      setSelectedNodes(nodes.map((node) => node.id));
    },
  });

  /** Deletes multiple nodes and all dangling edges connected to them
   * @param ids the ids of the nodes to delete
   */
  function deleteNodes(ids: string[]) {
    setNodes((nodes) => nodes.filter((node) => !ids.includes(node.id)));
    setEdges((edges) =>
      edges.filter(
        (edge) =>
          !ids.includes(edge.source) &&
          !ids.includes(edge.target) &&
          (nodesRecord[edge.source] || nodesRecord[edge.target]),
      ),
    );
  }

  /** Deletes all selected nodes */
  function deleteSelectedNodes() {
    deleteNodes(selectedNodes);
    setSelectedNodes([]);
  }

  // Edge State Toggling ------------------------------------------------------

  function setEdgeState(edgeID: string, state: TransfershipEdgeStates) {
    const edge = edgesRecord[edgeID];
    if (edge) {
      const newEdge: Edge = {
        ...edge,
        data: { ...edge.data, state },
      };
      setEdges((edges) => {
        const newEdges = edges.filter((edge) => edge.id !== edgeID);
        newEdges.push(newEdge);
        return newEdges;
      });
    }
  }

  // Path Expansion -----------------------------------------------------------

  // We use a ref to avoid stale closures
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [nodes, edges]);

  const addAddressPaths = useCallback(
    (paths: string[][], incoming: boolean) => {
      // Calculate result of adding path to the graph
      const { nodes: newNodes, edges: newEdges } = calculateNewAddressPath(
        nodesRef.current,
        edgesRef.current,
        paths,
        incoming,
      );

      // Set the new nodes and edges
      setNodes(newNodes);
      setEdges(newEdges);
    },
    [nodes.length, edges.length],
  );

  // useEffect: Whenever addAddressPaths changes, log it
  useEffect(() => {
    console.log("addAddressPaths changed");
  }, [addAddressPaths]);

  const addEdges = useCallback(
    (newEdges: Edge[]) => {
      const newStateEdges = calculateAddTransfershipEdges(edges, newEdges);
      setEdges(newStateEdges);
    },
    [edges, nodes],
  );

  // Address Focusing ---------------------------------------------------------

  /* One address can be focused at a time. This is tracked using a useState.
   * When an address is focused, it shows up on the AnalysisWindow overlaid
   * on top of the graph. */
  const [focusedAddressData, setFocusedAddressData] =
    useState<AddressAnalysis | null>(null);

  // New Address Highlighting -------------------------------------------------

  /** Sets the highlight of a node to either true or false.
   *
   * @param address The address of the node to highlight
   * @param highlight Whether to highlight the node or not
   */

  function setNodeHighlight(address: string, highlight: boolean) {
    const node = nodesRecord[address];
    if (node) {
      const newNode: Node = {
        ...node,
        data: {
          ...node.data,
          highlight: highlight,
        },
      };
      setNodes((nodes) => {
        const newNodes = nodes.filter((node) => node.id !== address);
        newNodes.push(newNode);
        return newNodes;
      });
    }
  }

  // Edge Hovering ------------------------------------------------------------

  const [hoveredTransferData, setHoveredTransferData] =
    useState<TransactionTooltipProps | null>(null);

  // Automatic Layout ---------------------------------------------------------

  function filterLayoutElements(): {
    filteredNodes: Node[];
    filteredEdges: Edge[];
  } {
    const filteredNodes = nodes;
    const filteredEdges = edges.filter(
      (edge) =>
        edge.data.state === TransfershipEdgeStates.REVEALED &&
        nodesRecord[edge.source] &&
        nodesRecord[edge.target],
    );
    return { filteredNodes, filteredEdges };
  }

  function setLayoutedElements(
    filteredNodes: Node[],
    filteredEdges: Edge[],
  ): Node[] {
    const newNodes = calculateLayoutedElements(filteredNodes, filteredEdges);
    setNodes(newNodes);
    return newNodes;
  }

  function doLayout(): void {
    const { filteredNodes, filteredEdges } = filterLayoutElements();
    const newNodes: Node[] = setLayoutedElements(filteredNodes, filteredEdges);

    setTimeout(() => {
      fitView({
        padding: 10,
        duration: 800,
        nodes: newNodes,
      });
    }, 250);
  }

  // Link Share ----------------------------------------------------------------

  function getLink(): string {
    const addressIDs: string[] = nodes.map((node) => node.id);
    const addressPaths: string[] = edges
      .filter(
        (edge) =>
          edge.data.state === TransfershipEdgeStates.REVEALED &&
          nodesRecord[edge.source] &&
          nodesRecord[edge.target],
      )
      .map((edge) => [edge.source, edge.target])
      .filter((edge) => edge[0] && edge[1])
      .map((edge) => edge.join("-"));
    return `${window.location.origin}?addresses=${addressIDs.join(
      ",",
    )}&paths=${addressPaths.join(",")}`;
  }

  async function copyLink(shortenedUrl: string): Promise<void> {
    const link = getLink();
    const key = shortenedUrl.split("/").pop()!;

    console.log("link: ", shortenedUrl);

    const storeUrlObj: StoreUrlObject = {
      originalUrl: link,
      key: key,
    };

    await firestore.storeUrl(storeUrlObj).then(async (id) => {
      if (id) {
        await navigator.clipboard.writeText(shortenedUrl);
        analytics.logAnalyticsEvent("copy_link", {
          link: shortenedUrl,
        });
      }
    });
  }

  // Getting the node count so that we can show the legend dynamically ---------

  function getNodeCount(): number {
    return nodes.length;
  }

  // Tutorial
  const [showTutorial, setShowTutorial] = useState<boolean>(false);

  // Set up the context
  const graphContext: GraphContextProps = {
    addAddressPaths,
    addEdges,
    setEdgeState,
    getEdgeVolumeScale,
    getEdgeHandleID,
    setFocusedAddressData,
    setHoveredTransferData,
    doLayout,
    getSharingLink: generateShortUrl,
    copyLink,
    setNodeHighlight,
    getNodeCount,
    setShowTutorial,
    focusedAddressData,
  };

  return (
    <>
      <GraphContext.Provider value={graphContext}>
        <div
          className="h-full w-full"
          onKeyDown={(event) => {
            if (event.key === "Delete" || event.key === "Backspace") {
              // Delete all selected nodes
              deleteSelectedNodes();
            }
            if (event.key === "Escape") {
              setFocusedAddressData(null);
            }
          }}
        >
          <DraggableWindow
            analysisData={focusedAddressData}
            setFocusedAddressData={setFocusedAddressData}
          />
          <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            fitView
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            panOnScroll
            selectionOnDrag
            panOnDrag={panOnDrag}
            selectionMode={SelectionMode.Partial}
            zoomOnDoubleClick={true}
            className="h-full w-full"
            maxZoom={1.5}
            minZoom={0.25}
          >
            <img
              className="-z-10 m-auto w-full scale-150 animate-pulse opacity-40"
              aria-hidden="true"
              src="https://tailwindui.com/img/beams-home@95.jpg"
            />
            {<Controls position="top-right" showInteractive={false} />}
            <TutorialPopup
              showTutorial={showTutorial}
              setShowTutorial={setShowTutorial}
            />
            <Background />
            <Panel position="top-left">
              <Legend />
            </Panel>
            <Panel position="top-right">
              {hoveredTransferData && (
                <TransactionTooltip
                  source={hoveredTransferData.source}
                  target={hoveredTransferData.target}
                  volume={hoveredTransferData.volume ?? 0}
                />
              )}
            </Panel>
            <Panel position="bottom-left">
              <Hotbar />
            </Panel>
          </ReactFlow>
        </div>
      </GraphContext.Provider>
    </>
  );
};

/** Graph + Landing Page - These are combined into one component for easy
 * animated transitions between the two. */

const useURLSearchParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const addresses = urlParams.get("addresses")?.split(",") || [];
  const paths = urlParams.get("paths")?.split(",") || [];
  return { addresses, paths };
};

const Graph: FC = () => {
  const [searchedAddresses, setSearchedAddresses] = useState<string[]>([]);
  const [searchedPaths, setSearchedPaths] = useState<string[]>([]);

  useEffect(() => {
    const { addresses, paths } = useURLSearchParams();
    if (addresses.length && paths.length) {
      setSearchedAddresses(addresses);
      setSearchedPaths(paths);
    }
  }, []);

  const onSetSearchedAddress = (newAddress: string) => {
    setSearchedAddresses([newAddress]);

    analytics.logAnalyticsEvent("search_address", {
      address: newAddress,
    });
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <Transition
        show={searchedAddresses.length === 0}
        appear={true}
        leave="transition-all duration-500"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-50"
        className="fixed flex h-full w-full flex-col items-center justify-center"
      >
        <LandingPage setSearchedAddress={onSetSearchedAddress} />
      </Transition>
      <Transition
        show={searchedAddresses.length > 0}
        appear={true}
        enter="transition-all duration-500 delay-500"
        enterFrom="opacity-0 scale-150"
        enterTo="opacity-100 scale-100"
        className="h-full w-full"
      >
        {searchedAddresses.length > 0 && (
          <GraphProvider
            initialAddresses={searchedAddresses}
            initialPaths={searchedPaths}
          />
        )}
      </Transition>
    </div>
  );
};

export default Graph;
