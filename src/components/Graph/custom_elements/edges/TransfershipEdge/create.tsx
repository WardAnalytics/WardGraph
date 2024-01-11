import { Edge, MarkerType } from "reactflow";

export default function createTransfershipEdge(
  source: string,
  target: string,
  volume: number,
): Edge {
  const id = `${source}-${target}`;
  const data = { volume };

  return {
    id,
    source,
    target,
    data,
    type: "TransfershipEdge",
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
    },
  };
}
