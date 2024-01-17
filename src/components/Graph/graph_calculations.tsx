import { Edge, Node, XYPosition } from "reactflow";
import {
  TransfershipEdgeStates,
  createTransfershipEdge,
} from "./custom_elements/edges/TransfershipEdge";
import {
  AddressNodeState,
  createAddressNode,
} from "./custom_elements/nodes/AddressNode";

import Dagre from "@dagrejs/dagre";

// How much distance there should be between two nodes when calculating new address nodes positions
const INTERSECTING_NODE_X_OFFSET = 300;
const INTERSECTING_NODE_Y_OFFSET = 130;

/* Records & Lists Conversion ---
 * - ReactFlow requires nodes and edges to be stored in a list for its hooks. This isn't good for performance.
 * - So, to improve performance when checking for duplicates, we convert the list into a record (dictionary) and
 * perform the operations so that it is O(n + operations) instead of O(n * operations). We then convert it back to
 * a list when we need to return it.
 */

/** Converts a list of nodes to a record of nodes with the id as the key
 * @param nodes the list of nodes to convert
 * @returns a dictionary of nodes with the id as the key
 */
export function convertNodeListToRecord(nodes: Node[]): Record<string, Node> {
  const dict: Record<string, Node> = {};
  nodes.forEach((node) => {
    dict[node.id] = node;
  });
  return dict;
}

/** Converts a list of edges to a record of edges with the id as the key
 *
 * @param edges the list of edges to convert
 * @returns a dictionary of edges with the id as the key
 */
export function convertEdgeListToRecord(edges: Edge[]): Record<string, Edge> {
  const dict: Record<string, Edge> = {};
  edges.forEach((edge) => {
    dict[edge.id] = edge;
  });
  return dict;
}

/** Checks if nodes are within a certain distance of each other
 * @param x the x position of the node
 * @param y the y position of the node
 * @param node the node to check against
 * @param xDistance the x distance between the nodes
 * @param yDistance the y distance between the nodes
 * @returns true if the nodes are within the distance, false otherwise
 */

function isNodeWithinDistance(
  x: number,
  y: number,
  node: Node,
  xDistance: number = INTERSECTING_NODE_X_OFFSET,
  yDistance: number = INTERSECTING_NODE_Y_OFFSET,
): boolean {
  return (
    Math.abs(x - node.position.x) < xDistance &&
    Math.abs(y - node.position.y) < yDistance
  );
}

/** Adds an address to the list of nodes and moves the cursor to the new position.
 * - Checks for duplicates
 * - Checks for intersections and moves out from them
 * - Accepts a nodes record to make it O(n + operations) instead of O(n * operations) for duplicate checking
 * - All operations are done on objects so no need to return anything
 *
 * @param nodesRecord the record of nodes
 * @param nodes the list of nodes
 * @param node the node to add
 * @param cursor the cursor to move to the new position
 */
function addAddressAux(
  nodesRecord: Record<string, Node>,
  nodes: Node[],
  node: Node,
) {
  // First, we check if the node already exists. If it does, we don't add it.
  const oldNode = nodesRecord[node.id];
  if (oldNode) {
    return;
  }
  // Finally, we add the node to the record and list and set the cursor to the node's position
  nodesRecord[node.id] = node;
  nodes.push(node);
}

/** Adds an edge to the list of edges.
 * If the edge already exists, it updates the volume to the higher of the two.
 * This is done because when adding a path, the edges of the address haven't been
 * revealed yet. As such, we add the edges of the path with a base volume of 0
 * when we find the real value we update it for real.
 * @param edgesRecord a record of all edges
 * @param edges a list of all edges
 * @param edge the edge to add
 */
function addEdgeAux(
  edgesRecord: Record<string, Edge>,
  edges: Edge[],
  edge: Edge,
) {
  // First, we check if the edge already exists. If it does, we'll compare the edge's volume and update it if it's higher
  const oldEdge = edgesRecord[edge.id];
  if (oldEdge) {
    oldEdge.data.volume = Math.max(oldEdge.data.volume, edge.data.volume);

    // If edge is revealed, we update the state
    if (edge.data.state !== TransfershipEdgeStates.HIDDEN) {
      oldEdge.data.state = edge.data.state;
    }

    return;
  }

  // Else, we add the edge to the record and list
  edgesRecord[edge.id] = edge;
  edges.push(edge);
}

/** Computes edges being added in bulk.
 * @param edges The edges of the graph
 * @param newEdges The new edges to add
 * @returns The new list of edges
 */

export function calculateAddTransfershipEdges(
  edges: Edge[],
  newEdges: Edge[],
): Edge[] {
  // Compute edgeList and edgeRecord to not override old edge list and reduce duplicate checking time
  const edgesRecord = convertEdgeListToRecord(edges);
  const edgesList = [...edges];

  // Add all edges
  newEdges.forEach((edge) => {
    addEdgeAux(edgesRecord, edgesList, edge);
  });

  return edgesList;
}

interface CalculateNewAddressPathsReturnType {
  nodes: Node[];
  edges: Edge[];
  finalNode: Node;
}

/** Calculates the new address paths to add to the graph.
 * @param nodes The list of nodes of the graph
 * @param edges The list of edges of the graph
 * @param addresses The list of addresses to add
 * @param incoming Whether the addresses are incoming or outgoing
 * @param volume The volume of the path
 * @returns The new list of nodes and edges
 */
export function calculateNewAddressPath(
  nodes: Node[],
  edges: Edge[],
  addresses: string[][],
  incoming: boolean,
): CalculateNewAddressPathsReturnType {
  /* Addresses are currently a list of parallel paths. We need to convert them to a list of 
  path positions, each having a list of addresses at that position. We also need to make 
  sure there are no duplicate addresses per path */
  const pathPositions: Record<number, string[]> = {};
  addresses.forEach((path) => {
    path.forEach((address, index) => {
      if (!pathPositions[index]) {
        pathPositions[index] = [];
      }
      if (!pathPositions[index].includes(address)) {
        pathPositions[index].push(address);
      }
    });
  });

  // Convert nodes and edges to a record of nodes and make a copy
  const nodesRecord = convertNodeListToRecord(nodes);
  const nodesList = [...nodes];
  const edgesRecord = convertEdgeListToRecord(edges);
  const edgesList = [...edges];

  /* Compute all edges between addresses and add them to the graph. We'll iterate
  over each path and add edges going from one address to another with a volume of -1
  as we can't quite know the quantity of each edge due to API limitations. When the 
  addresses finish loading, the value gets updated to the correct one so it's fine. */
  for (const path in addresses) {
    const pathAddresses = addresses[path];
    for (let i = 0; i < pathAddresses.length - 1; i++) {
      const fromAddress = incoming ? pathAddresses[i + 1] : pathAddresses[i];
      const toAddress = incoming ? pathAddresses[i] : pathAddresses[i + 1];
      const edge: Edge = createTransfershipEdge(
        fromAddress,
        toAddress,
        TransfershipEdgeStates.REVEALED,
        -1,
      );
      addEdgeAux(edgesRecord, edgesList, edge);
    }
  }

  // Get the origin address' node positions to set a cursor to that position
  const originAddress = addresses[0][0];
  const originNode = nodesRecord[originAddress];
  const cursor: XYPosition = {
    x: originNode.position.x,
    y: originNode.position.y,
  };

  // For each position, we'll be moving either left or right depending on whether it's incoming or outgoing.
  // In each position, we'll be moving upwards INTERSECTING_NODE_OFFSET with each address we add
  let finalNode: Node = originNode;
  for (const position in pathPositions) {
    // If it's the origin address, we skip it
    if (position === "0") continue;

    const addresses = pathPositions[position];

    // Move left or right depending on whether it's incoming or outgoing
    cursor.x += incoming
      ? -INTERSECTING_NODE_X_OFFSET * 1.1
      : INTERSECTING_NODE_X_OFFSET * 1.1;

    // Check for intersections within the current cursor X and Y and move out of the way
    while (true) {
      let intersectingNodesExist = false;
      for (const id in nodesRecord) {
        const node = nodesRecord[id];
        if (isNodeWithinDistance(cursor.x, cursor.y, node)) {
          intersectingNodesExist = true;
          break;
        }
      }
      if (!intersectingNodesExist) break;

      cursor.y -= INTERSECTING_NODE_Y_OFFSET * 1.25;
    }

    // For each address, we'll be adding a node and an edge
    let nodesInStack: number = 0;
    addresses.forEach((address) => {
      const node = createAddressNode(
        address,
        AddressNodeState.MINIMIZED,
        true,
        cursor.x,
        cursor.y - nodesInStack * INTERSECTING_NODE_Y_OFFSET,
      );

      if (!nodesRecord[node.id]) nodesInStack++;

      addAddressAux(nodesRecord, nodesList, node);
      finalNode = node;
    });
  }

  // Print each record

  return { nodes: nodesList, edges: edgesList, finalNode };
}

/** Calculates the layout of the graph using dagre.
 * @param dagreGraph The dagre graph object to use. Already setup by default
 * @param nodes Nodes to take into account
 * @param edges Edges to take into account
 * @param direction The direction of the graph
 * @returns The new lists of nodes and edges
 */

export function calculateLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction = "LR",
): Node[] {
  const dagreGraph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    ranksep: 150,
    nodesep: 100,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.width ? node.width : 200,
      height: node.height ? node.height : 50,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  Dagre.layout(dagreGraph);

  const newNodes: Node[] = [...nodes];
  dagreGraph.nodes().forEach((nodeId) => {
    const node = newNodes.find((n) => n.id === nodeId);
    if (node) {
      node.position = {
        x: dagreGraph.node(nodeId).x,
        y: dagreGraph.node(nodeId).y,
      };
    }
  });

  return newNodes;
}
