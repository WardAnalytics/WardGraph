import Dagre from "@dagrejs/dagre";
import { Node, Edge } from "reactflow";

function getLayoutedElements(
  graph: Dagre.graphlib.Graph,
  nodes: Node[],
  edges: Edge[],
): { nodes: Node[]; edges: Edge[] } {
  // Apply horizontal display settings to the graph
  graph.setGraph({ rankdir: "LR", ranksep: 150 });

  // Set edges and nodes for the entire graph
  // Maybe we can apply a set height and width to all nodes here?
  edges.forEach((edge) => graph.setEdge(edge.source, edge.target));
  nodes.forEach((node) => graph.setNode(node.id, node.id)); // What type am I supposed to put here? Why does this work? Wth is going on?

  // Apply the layout to the graph
  Dagre.layout(graph);

  // Return the coordinates of the nodes
  return {
    nodes: nodes.map((node) => {
      const { x, y } = graph.node(node.id);

      return { ...node, position: { x, y } };
    }),
    edges,
  };
}

export default getLayoutedElements;
