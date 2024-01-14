import {
  createContext,
  FC,
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
  useOnSelectionChange
} from "reactflow";

import {
  AddressNode,
  AddressNodeState,
  createAddressNode,
} from "./custom_elements/nodes/AddressNode";

import {
  TransfershipEdge,
  TransfershipEdgeStates
} from "./custom_elements/edges/TransfershipEdge";

import {
  calculateAddTransfershipEdges,
  calculatedNewFocusedAddress,
  calculateNewAddressPath,
  convertEdgeListToRecord,
  convertNodeListToRecord,
} from "./graph_calculations";

import "reactflow/dist/style.css";
import { AddressAnalysis } from "../../api/model";
import DraggableWindow from "./AnalysisWindow/AnalysisWindow";
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
  focusOnAddress: (address: string) => void;
  addEdges: (newEdges: Edge[]) => void;
  isAddressFocused: (address: string) => boolean;
  setEdgeState: (edgeID: string, state: TransfershipEdgeStates) => void;
  getEdgeVolumeScale: (volume: number) => number;
  getEdgeHandleID: (edgeID: string) => string;
  setFocusedAddressData: (data: AddressAnalysis | null) => void;
  setHoveredTransferData: (data: TransactionTooltipProps | null) => void;
  focusedAddressData: AddressAnalysis | null;
}

export const GraphContext = createContext<GraphContextProps>(
  {} as GraphContextProps,
);

/* The ReactFlowProvider must be above the GraphProvided component in the tree for ReactFlow's internal context to work
   Reference: https://reactflow.dev/api-reference/react-flow-provider#notes */
interface GraphProps {
  initialAddresses: string[];
}

const Graph: FC<GraphProps> = ({ initialAddresses }) => {
  // Grab all initial addresses and create nodes for them
  const initialNodes = useMemo(() => {
    const nodes: Node[] = [];
    initialAddresses.forEach((address) => {
      nodes.push(createAddressNode(address, AddressNodeState.MINIMIZED, 0, 0));
    });
    return nodes;
  }, [initialAddresses]);

  return (
    <div style={{ height: "100%" }}>
      <ReactFlowProvider>
        <GraphProvided initialNodes={initialNodes} />
      </ReactFlowProvider>
    </div>
  );
};

interface GraphProvidedProps {
  initialNodes: Node[];
}

const GraphProvided: FC<GraphProvidedProps> = ({ initialNodes }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

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

  /* Edges each have a volume associated and we want to scale their width
   * based on that. As such, we calculate the max and min volume of all visible
   * edges and get a function to scale the volume of an edge between 0 and 1. */
  const { minEdgeVolume, maxEdgeVolume } = useMemo(() => {
    let newMinEdgeVolume = Infinity;
    let newMaxEdgeVolume = -Infinity;

    edges.forEach((edge) => {
      if (edge.data.state === TransfershipEdgeStates.REVEALED) {
        newMinEdgeVolume = Math.min(newMinEdgeVolume, edge.data.volume);
        newMaxEdgeVolume = Math.max(newMaxEdgeVolume, edge.data.volume);
      }
    });

    return {
      minEdgeVolume: newMinEdgeVolume,
      maxEdgeVolume: newMaxEdgeVolume,
    };
  }, [edges]);

  /** Returns the scaled volume of an edge between 0 and 1
   * @param volume the volume of the edge
   * @returns the scaled volume of the edge
   */
  const getEdgeVolumeScale = useCallback(
    (volume: number): number => {
      const range = maxEdgeVolume - minEdgeVolume;
      return range === 0 ? 0 : (volume - minEdgeVolume) / range;
    },
    [maxEdgeVolume, minEdgeVolume],
  );

  // Node & Edge Manipulation Functions ---

  /** Adds a node to the graph. If the node already exists, it is not added.
   * @param newNode the node to add
   */
  /* function addNewNode(newNode: Node) {
    // If node with same id already exists, don't add it
    if (nodes.find((node) => node.id === newNode.id)) {
      return;
    }
    setNodes((nodes) => [...nodes, newNode]);
  } */

  /** Deletes multiple nodes and all edges connected to them
   * @param ids the ids of the nodes to delete
   */
  function deleteNodes(ids: string[]) {
    setNodes((nodes) => nodes.filter((node) => !ids.includes(node.id)));
    setEdges((edges) => edges.filter((edge) => !ids.includes(edge.source)));
    setEdges((edges) => edges.filter((edge) => !ids.includes(edge.target)));
  }

  /** Updates selected nodes whenever a new selection is made */
  useOnSelectionChange({
    onChange: ({ nodes }) => {
      setSelectedNodes(nodes.map((node) => node.id));
    },
  });

  /** Deletes all selected nodes */
  function deleteSelectedNodes() {
    deleteNodes(selectedNodes);
    setSelectedNodes([]);
  }

  /** Focuses on a specific address node, setting it to EXPANDED and everything else to MINIMIZED.
   * Also pans the graph to the node.
   * @param address the address to focus on
   */
  function focusOnAddress(address: string) {
    // Calculate and set the new nodes
    const newNodes = calculatedNewFocusedAddress(nodes, address);
    setNodes(newNodes);
  }

  function isAddressFocused(address: string): boolean {
    const node = nodesRecord[address];
    if (node) {
      return node.data.state === AddressNodeState.EXPANDED;
    }
    return false;
  }

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

  function addAddressPaths(
    paths: string[][],
    incoming: boolean,
    volume: number,
  ) {
    // 1 - Calculate result of adding path to the graph
    const {
      nodes: newNodes,
      edges: newEdges,
      //finalNode,
    } = calculateNewAddressPath(nodes, edges, paths, incoming, volume);

    // 2 - Calculate result of focusing on a node
    // const focusedNodes = calculatedNewFocusedAddress(newNodes, finalNode.id);

    // 3 - Set the new nodes and edges
    setNodes(newNodes);
    setEdges(newEdges);
  }

  function addEdges(newEdges: Edge[]) {
    const newStateEdges = calculateAddTransfershipEdges(edges, newEdges);
    setEdges(newStateEdges);
  }

  /* One address can be focused at a time. This is tracked using a useState.
   * When an address is focused, it shows up on the AnalysisWindow overlaid
   * on top of the graph.
   */
  //
  const [focusedAddressData, setFocusedAddressData] =
    useState<AddressAnalysis | null>(null);

  const [hoveredTransferData, setHoveredTransferData] =
    useState<TransactionTooltipProps | null>(null);

  // Set up the context
  const graphContext: GraphContextProps = {
    addAddressPaths,
    focusOnAddress,
    addEdges,
    isAddressFocused,
    setEdgeState,
    getEdgeVolumeScale,
    getEdgeHandleID,
    setFocusedAddressData,
    setHoveredTransferData,
    focusedAddressData,
  };

  return (
    <>
      <div
        style={{ height: "100%" }}
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
        <GraphContext.Provider value={graphContext}>
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
          >
            <img
              className="-z-10 m-auto w-full scale-150 opacity-40"
              aria-hidden="true"
              src="https://tailwindui.com/img/beams-home@95.jpg"
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
            <Controls position="bottom-right" showInteractive={false} />
          </ReactFlow>
        </GraphContext.Provider>
      </div>
    </>
  );
};

export default Graph;
