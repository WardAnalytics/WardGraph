import { createContext, useCallback, useState, useEffect, FC } from "react";
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

import "reactflow/dist/style.css";

/* Pan on drag settings */
const panOnDrag = [1, 2];

/* Custom Nodes & Edges */
const nodeTypes = { AddressNode: AddressNode };
const edgeTypes = {};

/* Automatic Layout Setup */
const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

/* Context for variable handling */
interface GraphContextProps {
  addAddressPaths: (paths: string[][], incoming: boolean) => void;
  focusOnAddress: (address: string) => void;
}

export const GraphContext = createContext<GraphContextProps>({
  addAddressPaths: () => {},
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

const initialTestNode = createAddressNode(
  "0xdac17f958d2ee523a2206206994597c13d831ec7",
  AddressNodeState.MINIMIZED,
  0,
  0,
);

const GraphProvided: FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([initialTestNode]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const reactFlowInstance: ReactFlowInstance = useReactFlow();

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
      console.log("Attempted to add a node that already exists: " + newNode.id);
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

  /** Adds a new address to the graph.
   * @param address the address to add
   * @param state the state of the address (either MINIMIZED or EXPANDED)
   * @param x the x position of the node
   * @param y the y position of the node
   */
  function addNewAddress(
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

      setViewport({ x, y, zoom: 1 }, { duration: 300 });
    }
  }

  /** Focuses on a specific address node, setting it to EXPANDED and everything else to MINIMIZED.
   * Also pans the graph to the node.
   * @param address the address to focus on
   */
  function focusOnAddress(address: string) {
    // Iterate over all nodes and set them to MINIMIZED except the one we want to focus on
    const newNodes = nodes.map((node) => {
      if (node.id === address) {
        return {
          ...node,
          data: { ...node.data, state: AddressNodeState.EXPANDED },
        };
      } else {
        return {
          ...node,
          data: { ...node.data, state: AddressNodeState.MINIMIZED },
        };
      }
    });

    // Update state
    setNodes(newNodes);

    // Slowly the graph to the node
    panToAddress(address);
  }

  /** Adds a path of addresses to the graph. The first address is guaranteed to be in the graph already.
   * There is also an 'incoming' boolean to indicate whether the path is incoming or
   * outgoing and add the edges in the correct direction.
   * @param paths the paths to add
   * @param incoming whether the path is incoming or outgoing
   */
  /*
  function addAddressPaths(paths: string[][], incoming: boolean) {
    // Get coordinates of first node and start from there
    const firstNode = nodes.find((node) => node.id === paths[0][0]);
    if (!firstNode) {
      console.error(
        "Attempted to add paths to a node that doesn't exist: " + paths[0][0],
      );
      return { nodes: [], edges: [] };
    }

    // For each path and then each address inside that
    paths.forEach((addresses, p) => {
      let x = firstNode.position.x + 50;
      const y = firstNode.position.y - p * 75;

      addresses.forEach((address, a) => {
        // Calculate which x position to spawn the node at. Incoming goes left, outgoing goes right. The first and last nodes to be added must be at an extra distance. The rest are evenly spaced.
        const isLast = a === addresses.length - 1;
        const incomingMultiplier = incoming ? -1 : 1;

        // Skip first address. Can't just exclude it from the array cause it's still needed in the edge
        if (a !== 0) {
          if (incoming && isLast) {
            x += 1200 * incomingMultiplier;
          } else {
            x += 350 * incomingMultiplier;
          }

          // If it's in any of the previous paths at the same position, don't add it either.
          const alreadyAdded = paths
            .slice(0, p)
            .some((path) => path[a] === address);

          if (!alreadyAdded) {
            console.log(
              "Creating address " + address.slice(0, 10) + " at x " + x,
            );
            addNewAddress(address, isLast, x, y);
          }

          // Create a new edge connecting the new node to the previous one
          const newEdge = incoming
            ? createEdge(address, paths[p][a - 1])
            : createEdge(paths[p][a - 1], address);

          addNewEdge(newEdge);
        }
      });
    });
  }
    */

  function addAddressPaths(paths: string[][], incoming: boolean) {
    return;
  }

  // Set up the context
  const graphContext = {
    addAddressPaths,
    focusOnAddress,
  };

  return (
    <div style={{ height: "100%" }}>
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
          onKeyDown={(event) => {
            if (event.key === "Delete" || event.key === "Backspace") {
              deleteSelectedNodes();
            }
          }}
        >
          <Background />
          <Controls position="bottom-right" showInteractive={false} />
          <MiniMap position="top-right" pannable zoomable />
        </ReactFlow>
      </GraphContext.Provider>
    </div>
  );
};

export default Graph;
