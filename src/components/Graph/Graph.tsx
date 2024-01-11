import { createContext, useEffect, useCallback, useState, FC } from "react";
import Dagre from "@dagrejs/dagre";
import ReactFlow, {
  addEdge,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  SelectionMode,
  ReactFlowInstance,
  useReactFlow,
  useOnSelectionChange,
} from "reactflow";
import getLayoutedElements from "./layout";

import {
  createAddressNode,
  AddressNodeState,
  AddressNode,
} from "./custom_elements/nodes/AddressNode";

import {
  createTransfershipEdge,
  TransfershipEdge,
  TransfershipEdgeStates,
} from "./custom_elements/edges/TransfershipEdge";

import {
  convertEdgeListToRecord,
  convertNodeListToRecord,
  calculateNewAddressPath,
  calculatedNewFocusedAddress,
  calculateAddTransfershipEdges,
} from "./graph_calculations";

import "reactflow/dist/style.css";

/* Pan on drag settings */
const panOnDrag = [1, 2];

/* Custom Nodes & Edges */
const nodeTypes = { AddressNode: AddressNode };
const edgeTypes = { TransfershipEdge: TransfershipEdge };

/* Automatic Layout Setup */
const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

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
}

export const GraphContext = createContext<GraphContextProps>({
  addAddressPaths: () => {},
  focusOnAddress: () => {},
  addEdges: () => {},
  isAddressFocused: () => false,
  setEdgeState: () => {},
});

/* The ReactFlowProvider must be above the GraphProvided component in the tree for ReactFlow's internal context to work
   Reference: https://reactflow.dev/api-reference/react-flow-provider#notes */
const Graph: FC = () => {
  return (
    <ReactFlowProvider>
      <GraphProvided />
    </ReactFlowProvider>
  );
};

const initialTestNode1 = createAddressNode(
  "0xe71472c7bcd57bfefab8bf7de4a7a9021d99e43b",
  AddressNodeState.MINIMIZED,
  0,
  150,
);

const initialTestNode2 = createAddressNode(
  "0x07840b4825b74cc6ce264bf2743dee647194f49b",
  AddressNodeState.MINIMIZED,
  0,
  0,
);

const GraphProvided: FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    initialTestNode1,
    initialTestNode2,
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [nodesRecord, setNodesRecord] = useState<Record<string, Node>>({});
  const [edgesRecord, setEdgesRecord] = useState<Record<string, Edge>>({});

  // Whenever nodes and edges change, update the records. This is done for performance reasons
  useEffect(() => {
    const newNodesRecord = convertNodeListToRecord(nodes);
    setNodesRecord(newNodesRecord);
  }, [nodes]);
  useEffect(() => {
    const newEdgesRecord = convertEdgeListToRecord(edges);
    setEdgesRecord(newEdgesRecord);
  }, [edges]);

  const { setViewport } = useReactFlow();

  /* Callback to automatically layout the full graph */
  const onLayout = useCallback(() => {
    const layouted = getLayoutedElements(g, nodes, edges);

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);
  }, [nodes, edges]);

  // Node & Edge Manipulation Functions ---

  /** Adds a node to the graph. If the node already exists, it is not added.
   * @param newNode the node to add
   */
  function addNewNode(newNode: Node) {
    // If node with same id already exists, don't add it
    if (nodes.find((node) => node.id === newNode.id)) {
      return;
    }
    setNodes((nodes) => [...nodes, newNode]);
  }

  /** Adds an edge to the graph. If the edge already exists, it is not added.
   * @param newEdge the edge to add
   */
  function addNewEdge(newEdge: Edge) {
    setEdges((oldEdges) => addEdge(newEdge, oldEdges));
  }

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

  /** Adds a single new address to the graph. This function **SHOULD NOT BE USED** to add multiple addresses at once in any way, shape, or form.
   * @param address the address to add
   * @param state the state of the address (either MINIMIZED or EXPANDED)
   * @param x the x position of the node
   * @param y the y position of the node
   */
  function addIndividualAddress(
    address: string,
    state: AddressNodeState,
    x: number,
    y: number,
  ) {
    const newNode: Node = createAddressNode(address, state, x, y);
    addNewNode(newNode);
  }

  /** Pans to a specific address node.
   * @param address the address to pan to
   */
  function panToAddress(address: string) {
    const node = nodes.find((node) => node.id === address);
    if (node) {
      const x = -node.position.x + window.innerWidth / 3;
      const y = -node.position.y + window.innerHeight / 3 - 100;

      setViewport({ x, y, zoom: 1.2 }, { duration: 300 });
    }
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
      finalNode,
    } = calculateNewAddressPath(nodes, edges, paths, incoming, volume);

    // 2 - Calculate result of focusing on a node
    const focusedNodes = calculatedNewFocusedAddress(newNodes, finalNode.id);

    // 3 - Set the new nodes and edges
    setNodes(focusedNodes);
    setEdges(newEdges);
  }

  function addEdges(newEdges: Edge[]) {
    const newStateEdges = calculateAddTransfershipEdges(edges, newEdges);
    setEdges(newStateEdges);
  }

  /**
   */

  // State to store stack of previous states for undo
  interface FlowState {
    nodes: Node[];
    edges: Edge[];
  }

  // Whenever the number of nodes changes, add the new state to the stack
  const [flowStates, setFlowStates] = useState<FlowState[]>([]);
  useEffect(() => {
    setFlowStates([...flowStates, { nodes: nodes, edges: edges }]);
  }, [nodes.length, edges.length]);

  function undoState() {
    if (flowStates.length > 1) {
      const previousState = flowStates[flowStates.length - 2];
      setNodes(previousState.nodes);
      setEdges(previousState.edges);
      setFlowStates(flowStates.slice(0, flowStates.length - 2));
      return;
    }
  }

  // Set up the context
  const graphContext = {
    addAddressPaths,
    focusOnAddress,
    addEdges,
    isAddressFocused,
    setEdgeState,
  };

  return (
    <div
      style={{ height: "100%" }}
      onKeyDown={(event) => {
        if (event.key === "Delete" || event.key === "Backspace") {
          // Delete all selected nodes
          deleteSelectedNodes();
        }
        if (event.key === "Escape") {
          // Onfocus all nodes
          setNodes((nodes) =>
            nodes.map((node) => ({
              ...node,
              data: { ...node.data, state: AddressNodeState.MINIMIZED },
            })),
          );
        }
        if (event.key === "z") {
          // Undo
          undoState();
        }
      }}
    >
      <GraphContext.Provider value={graphContext}>
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
            className="-z-10 m-auto w-full scale-150 pt-20 opacity-40"
            aria-hidden="true"
            src="https://tailwindui.com/img/beams-home@95.jpg"
          />
          <Background />
          <Controls position="bottom-right" showInteractive={false} />
          <MiniMap position="top-right" pannable zoomable />
        </ReactFlow>
      </GraphContext.Provider>
    </div>
  );
};

export default Graph;
