/** Enum for the states of the TransfershipEdge component.
 * - HIDDEN: The edge is only visible in red when the user hovers over the source or target node.
 * - REVEALED: The edge is visible and has a label with the amount of tokens transferred.
 */

enum TransfershipEdgeStates {
  HIDDEN = "HIDDEN",
  REVEALED = "REVELAED",
}

export default TransfershipEdgeStates;
