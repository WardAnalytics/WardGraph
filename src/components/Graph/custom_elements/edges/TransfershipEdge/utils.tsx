import { Position, internalsSymbol, Node, HandleElement } from "reactflow";

/** Returns the horizontal center coordinate of a node.
 * @param node The node to get the center coordinate from
 * @returns The horizontal center coordinate of the node
 */
export function getNodeCenterX(node: Node): number | null {
  if (!node.positionAbsolute || !node.width) {
    return null;
  }

  return node?.positionAbsolute.x + node.width / 2;
}

/** Returns the coordinates of a node's handle by its position
 * @param node The node to get the handle coordinates from
 * @param handlePosition The position of the handle to get the coordinates from
 * @returns The coordinates of the handle
 */
function getHandleCoordsByPosition(
  node: Node,
  handlePosition: Position,
  target: boolean = false,
) {
  const handle: HandleElement | undefined = target
    ? node[internalsSymbol]!.handleBounds!.target!.find(
        (h) => h.position === handlePosition,
      )
    : node[internalsSymbol]!.handleBounds!.source!.find(
        (h) => h.position === handlePosition,
      );

  if (!handle) {
    return [0, 0];
  }

  let offsetX = handle.width / 2;
  let offsetY = handle.height / 2;

  // this is a tiny detail to make the markerEnd of an edge visible.
  // The handle position that gets calculated has the origin top-left, so depending which side we are using, we add a little offset
  // when the handlePosition is Position.Right for example, we need to add an offset as big as the handle itself in order to get the correct position
  switch (handlePosition) {
    case Position.Left:
      offsetX = 0;
      break;
    case Position.Right:
      offsetX = handle.width;
      break;
  }

  const x = node.positionAbsolute!.x + handle.x + offsetX;
  const y = node.positionAbsolute!.y + handle.y + offsetY;

  return [x, y];
}

/** Returns the position of a node compared to another node.
 *
 * @param nodeA The node to cmopare
 * @param nodeB The node to compare to
 * @returns The position of nodeA compared to nodeB
 */
function getHandleParams(nodeA: Node, nodeB: Node): [number, number, Position] {
  const centerA: number | null = getNodeCenterX(nodeA);
  const centerB: number | null = getNodeCenterX(nodeB);

  if (!centerA || !centerB) {
    return [0, 0, Position.Top];
  }

  const position = centerA > centerB ? Position.Left : Position.Right;

  const [x, y] = getHandleCoordsByPosition(nodeA, position);
  return [x, y, position];
}

/** Returns the parameters needed to draw an edge between two nodes.
 * The parameters are the source and target coordinates and the source and target positions.
 * @param source The source node
 * @param target The target node
 * @returns The parameters needed to draw an edge between two nodes
 */
export default function getEdgeParams(source: Node, target: Node) {
  const [sx, sy, sourcePos] = getHandleParams(source, target);
  const [tx, ty, targetPos] = getHandleParams(target, source);

  return {
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
  };
}
