import { Edge } from "reactflow";
import TransfershipEdgeStates from "./states";

export default function createTransfershipEdge(
  source: string,
  target: string,
  state: TransfershipEdgeStates = TransfershipEdgeStates.HIDDEN,
  volume: number,
): Edge {
  const id = `${source}-${target}`;
  const data = { volume, state };

  return {
    id,
    source,
    target,
    data,
    type: "TransfershipEdge",
    animated: false,
    sourceHandle: "a",
    targetHandle: "a",
    // markerEnd: {
    //   type: MarkerType.ArrowClosed,
    //   width: 20,
    //   height: 20,
    // },
  };
}
