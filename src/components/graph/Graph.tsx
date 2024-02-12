import {
  FC,
  createContext,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactFlow, {
  Background,
  Edge,
  Node,
  Panel,
  ReactFlowProvider,
  SelectionMode,
  useEdgesState,
  useKeyPress,
  useNodesState,
  useOnSelectionChange,
  useReactFlow,
  useUpdateNodeInternals,
} from "reactflow";
import "reactflow/dist/style.css";
import debounce from "lodash/debounce";

import { createSharableGraph } from "../../services/firestore/graph_sharing";

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

import TutorialPopup from "./tutorial/TutorialPopup";
import DraggableWindow from "./analysis_window/AnalysisWindow";
import Hotbar from "./hotbar";
import Legend from "./legend";
import TransactionTooltip from "./TransactionTooltip";
import { TransactionTooltipProps } from "./TransactionTooltip";

enum HotKeyMap {
  DELETE = 1,
  BACKSPACE,
  ESCAPE,
  UNDO,
  REDO,
}

/* Pan on drag settings */
const panOnDrag = [1, 2];

/* Custom Nodes & Edges */
const nodeTypes = { AddressNode: AddressNode };
const edgeTypes = { TransfershipEdge: TransfershipEdge };

/* For expanding paths */
export interface PathExpansionArgs {
  paths: string[][];
  incoming: boolean;
}

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
  doLayout: () => void;
  setNodeHighlight: (address: string, highlight: boolean) => void;
  getNodeCount: () => number;
  setShowTutorial: (show: boolean) => void;
  addNewAddressToCenter: (address: string) => void;
  addMultipleDifferentPaths: (pathArgs: PathExpansionArgs[]) => void;
  deleteNodes: (ids: string[]) => void;
  getAddressRisk: (address: string) => number;
  registerAddressRisk: (address: string, risk: number) => void;
  focusedAddressData: AddressAnalysis | null;
  isRiskVision: boolean;
  setShowRiskVision: (show: boolean) => void;
  generateSharableLink: () => Promise<string>;
  isSavedGraph: boolean;
}

export const GraphContext = createContext<GraphContextProps>(
  {} as GraphContextProps,
);

/*  */
/** Graph + Landing Page - These are combined into one component for easy
 * animated transitions between the two. */

interface GraphProps {
  initialAddresses: string[];
  initialPaths: string[];
  onAutoSave?: (addresses: string[], paths: string[]) => void;
}

/** Graph simply wraps the ReactFlowProvider and provides the initial nodes
 * for the graph to start. This is required due to the way ReactFlow works.
 *
 * The ReactFlowProvider must be above the GraphProvided component in the tree for ReactFlow's internal context to work.
 * Reference: https://reactflow.dev/api-reference/react-flow-provider#notes
 * @param initialAddresses the addresses to start the graph with
 * @returns
 */

const Graph: FC<GraphProps> = ({
  initialAddresses,
  initialPaths,
  onAutoSave,
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

  const initialLayoutedNodes = useMemo(() => {
    if (initialNodes.length === 0) return [];

    return calculateLayoutedElements(initialNodes, initialEdges);
  }, [initialNodes, initialEdges]);

  // We make sure to calculate the layouted nodes and edges before rendering
  return (
    <>
      <div style={{ height: "100%" }}>
        <ReactFlowProvider>
          <GraphProvided
            initialNodes={initialLayoutedNodes}
            initialEdges={initialEdges}
            onAutoSave={onAutoSave}
          />
        </ReactFlowProvider>
      </div>
    </>
  );
};

interface GraphProvidedProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  onAutoSave?: (addresses: string[], paths: string[]) => void;
}

const MemoedDraggableWindow = memo(DraggableWindow);

/** GraphProvided is the main component that renders the graph and handles
 * most logic. It is wrapped by GraphProvider for the ReactFlowProvider.
 * @param initialNodes the initial nodes to start the graph with
 */
const GraphProvided: FC<GraphProvidedProps> = ({
  initialNodes,
  initialEdges,
  onAutoSave,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { fitView, screenToFlowPosition } = useReactFlow();

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

  // For the first 5 seconds after mounting, we want to updateNodeInternals for all nodes every 100ms
  const [firstUpdate, setFirstUpdate] = useState<boolean>(true);
  useEffect(() => {
    if (firstUpdate) {
      const interval = setInterval(() => {
        nodes.forEach((node) => {
          updateNodeInternals(node.id);
        });
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
        setFirstUpdate(false);
      }, 5000);
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

  // Auto Save -----------------------------------------------------------------

  /* We want to save the graph whenever a change is made. We'll use a debounce
   * to prevent too many saves from happening at once. */

  const saveGraph = useCallback(
    (addresses: string[], paths: string[]) => {
      if (onAutoSave) {
        onAutoSave(addresses, paths);
      }
    },
    [nodes.length, edges.length],
  );

  const debouncedSave = useRef(
    debounce((addresses: string[], paths: string[]) => {
      saveGraph(addresses, paths);
    }, 1000),
  );

  useEffect(() => {
    if (nodes.length === 0) return;

    const addresses: string[] = nodes.map((node) => node.id);
    const paths: string[] = edges.map((edge) =>
      [edge.source, edge.target].join("-"),
    );
    debouncedSave.current(addresses, paths);
  }, [nodes.length, edges.length]);

  // Undo and Redo -------------------------------------------------------------

  /* For this, we'll use a simple undo and redo system. We'll store the
   * previous state of the graph in a stack and whenever a change is made,
   * we'll push the previous state onto the stack.
   *
   * When undo is pressed, we'll walk back one state from the last. If any
   * change is recorded after that, we'll delete all the states after the current
   * state and push the new state onto the stack. If none are pressed, the user
   * can still redo to the last state. */

  interface GraphState {
    nodes: Node[];
    edges: Edge[];
  }

  const [graphStates, setGraphStates] = useState<GraphState[]>([
    { nodes: initialNodes, edges: initialEdges },
  ]);
  const [undoDepth, setUndoDepth] = useState<number>(0);
  const [isUndoRedoAction, setIsUndoRedoAction] = useState<boolean>(false);

  const addGraphState = useCallback(
    (newState: GraphState) => {
      if (isUndoRedoAction) {
        setIsUndoRedoAction(false); // Reset flag after undo/redo action
        return;
      }

      setGraphStates((prevStates) => {
        const trimmedStates =
          undoDepth > 0 ? prevStates.slice(0, -undoDepth) : prevStates;
        const newStates =
          trimmedStates.length >= 10
            ? trimmedStates.slice(1).concat(newState)
            : trimmedStates.concat(newState);
        setUndoDepth(0); // Reset undo depth on new state
        return newStates;
      });
    },
    [undoDepth, isUndoRedoAction],
  );

  useEffect(() => {
    addGraphState({ nodes, edges });
  }, [nodes.length]);

  const undo = useCallback(() => {
    if (graphStates.length <= 1 || undoDepth >= graphStates.length - 1) return;

    setUndoDepth((depth) => depth + 1);
    setIsUndoRedoAction(true); // Set flag to prevent state save
  }, [graphStates.length, undoDepth]);

  const redo = useCallback(() => {
    if (undoDepth <= 0) return;

    setUndoDepth((depth) => Math.max(depth - 1, 0));
    setIsUndoRedoAction(true); // Set flag to prevent state save
  }, [undoDepth]);

  // Assuming `setNodes` and `setEdges` modify the actual React state for nodes and edges
  useEffect(() => {
    if (undoDepth > 0) {
      const currentState = graphStates[graphStates.length - 1 - undoDepth];
      setNodes(currentState.nodes);
      setEdges(currentState.edges);
    }
  }, [undoDepth, graphStates]);

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
  const deleteNodes = useCallback(
    (ids: string[]) => {
      setNodes((nodes) => nodes.filter((node) => !ids.includes(node.id)));
      setEdges((edges) =>
        edges.filter(
          (edge) =>
            !ids.includes(edge.source) &&
            !ids.includes(edge.target) &&
            (nodesRecord[edge.source] || nodesRecord[edge.target]),
        ),
      );
    },
    [nodes.length],
  );

  /** Deletes all selected nodes */
  const deleteSelectedNodes = useCallback(() => {
    deleteNodes(selectedNodes);
    onAddressFocusOff();
  }, [deleteNodes, selectedNodes]);

  const onAddressFocusOff = useCallback(() => {
    setFocusedAddressData(null);
  }, []);

  // Key Press Handling -------------------------------------------------------

  const deleteKeyPressed = useKeyPress("Delete") ? HotKeyMap.DELETE : false;
  const backspaceKeyPressed = useKeyPress("Backspace")
    ? HotKeyMap.BACKSPACE
    : false;
  const escapeKeyPressed = useKeyPress("Escape") ? HotKeyMap.ESCAPE : false;

  // Ctrl Z and Ctrl Y for undo and redo
  const undoPressed = useKeyPress(["z"]) ? HotKeyMap.UNDO : false;
  const redoPressed = useKeyPress(["y"]) ? HotKeyMap.REDO : false;

  const keyPressed = useMemo(
    () =>
      deleteKeyPressed ||
      backspaceKeyPressed ||
      escapeKeyPressed ||
      undoPressed ||
      redoPressed,
    [
      deleteKeyPressed,
      backspaceKeyPressed,
      escapeKeyPressed,
      undoPressed,
      redoPressed,
    ],
  );

  useEffect(() => {
    switch (keyPressed) {
      case HotKeyMap.DELETE:
      case HotKeyMap.BACKSPACE:
        deleteSelectedNodes();
        setSelectedNodes([]);
        break;
      case HotKeyMap.ESCAPE:
        onAddressFocusOff();
        setSelectedNodes([]);
        break;
      case HotKeyMap.UNDO:
        undo();
        break;
      case HotKeyMap.REDO:
        redo();
        break;
      default:
        break;
    }
  }, [keyPressed]);

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

  const addMultipleDifferentPaths = useCallback(
    (pathArgs: PathExpansionArgs[]) => {
      // Separate the paths into incoming and outgoing
      const incomingPaths: string[][] = [];
      const outgoingPaths: string[][] = [];
      pathArgs.forEach((pathArg) => {
        if (pathArg.incoming) {
          incomingPaths.push(...pathArg.paths);
        } else {
          outgoingPaths.push(...pathArg.paths);
        }
      });

      let newNodes: Node[] = nodes;
      let newEdges: Edge[] = edges;

      if (incomingPaths.length > 0) {
        const { nodes: incomingNodes, edges: incomingEdges } =
          calculateNewAddressPath(newNodes, newEdges, incomingPaths, true);
        newNodes = incomingNodes;
        newEdges = incomingEdges;
      }

      if (outgoingPaths.length > 0) {
        const { nodes: outgoingNodes, edges: outgoingEdges } =
          calculateNewAddressPath(newNodes, newEdges, outgoingPaths, false);
        newNodes = outgoingNodes;
        newEdges = outgoingEdges;
      }

      // Set the new nodes and edges
      setNodes(newNodes);
      setEdges(newEdges);
    },
    [nodes.length, edges.length],
  );

  const addEdges = useCallback(
    (newEdges: Edge[]) => {
      const newStateEdges = calculateAddTransfershipEdges(
        edges,
        nodesRecord,
        newEdges,
      );
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

  // Adding New Address -------------------------------------------------------

  function addNewAddressToCenter(address: string) {
    // Calculate flow position of the center of the screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const graphCenterPosition = screenToFlowPosition({
      x: centerX,
      y: centerY,
    });

    // Add new node while accounting for the node width and height so that it's truly at the center
    const newNode = createAddressNode(
      address,
      AddressNodeState.MINIMIZED,
      true,
      graphCenterPosition.x - 100,
      graphCenterPosition.y - 50,
    );
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
  }

  // Edge Hovering ------------------------------------------------------------

  const [hoveredTransferData, setHoveredTransferData] =
    useState<TransactionTooltipProps | null>(null);

  // Node Risk Tracking & Risk Vision -----------------------------------------

  /* When risk vision is on, we make the nodes colored based on their risk
   * and we change the color of the edges so that they are instead based on
   * the risk of the nodes they connect (with pretty gradients). */

  const [isRiskVision, setIsRiskVision] = useState<boolean>(false);

  /* This is required so that the edges in risk vision and easily have access
   * to the risk of the nodes they are connected to.
   *
   * We do this by register of a node when its risk is known. */

  const [nodeRisk, setNodeRisk] = useState<Map<string, number>>(new Map());

  const registerAddressRisk = useCallback((address: string, risk: number) => {
    setNodeRisk((nodeRisk) => {
      const newNodeRisk = new Map(nodeRisk);
      newNodeRisk.set(address, risk);
      return newNodeRisk;
    });
  }, []);

  const getAddressRisk = useCallback(
    (address: string): number => {
      return nodeRisk.get(address) ?? 0;
    },
    [nodeRisk],
  );

  // Automatic Layout ---------------------------------------------------------

  function filterLayoutElements(): {
    filteredNodes: Node[];
    filteredEdges: Edge[];
  } {
    if (nodes.length === 0) return { filteredNodes: [], filteredEdges: [] };

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
    if (filteredNodes.length === 0) return [];

    const newNodes = calculateLayoutedElements(filteredNodes, filteredEdges);
    setNodes(newNodes);
    return newNodes;
  }

  function doLayout(): void {
    const { filteredNodes, filteredEdges } = filterLayoutElements();
    const newNodes: Node[] = setLayoutedElements(filteredNodes, filteredEdges);

    setTimeout(() => {
      fitView({
        duration: 800,
        nodes: newNodes,
      });
    }, 250);
  }

  // Link Share ----------------------------------------------------------------

  const generateSharableLink = useCallback(async () => {
    const addresses: string[] = nodes.map((node) => node.id);
    const paths: string[] = edges.map(
      (edge) => `${edge.source}-${edge.target}`,
    );

    const link = createSharableGraph({ addresses, edges: paths });
    return link;
  }, [nodes.length, edges.length]);

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
    generateSharableLink,
    setNodeHighlight,
    getNodeCount,
    setShowTutorial,
    addNewAddressToCenter,
    addMultipleDifferentPaths,
    deleteNodes,
    getAddressRisk,
    registerAddressRisk,
    focusedAddressData,
    isRiskVision,
    setShowRiskVision: setIsRiskVision,
    isSavedGraph: onAutoSave !== undefined,
  };

  return (
    <>
      <GraphContext.Provider value={graphContext}>
        <div className="h-full w-full">
          <MemoedDraggableWindow
            analysisData={focusedAddressData}
            onExit={onAddressFocusOff}
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
            {/* {<Controls position="top-right" showInteractive={false} />} */}
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
            <Panel position="bottom-right">
              <Hotbar />
            </Panel>
          </ReactFlow>
        </div>
      </GraphContext.Provider>
    </>
  );
};

export { Graph };
