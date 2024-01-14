import { FC } from "react";
import { ChevronDoubleRightIcon } from "@heroicons/react/16/solid";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "reactflow";

const TransfershipEdge: FC<EdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  //data,
  markerEnd,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  //const volume: number = data?.volume ?? 0;

  // Calculate the angle of the edge (in degrees)
  const angle = Math.round(
    Math.atan2(targetY - sourceY, targetX - sourceX) * (180 / Math.PI),
  );

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <div className="relative inline-flex items-center gap-x-1.5 rounded-full bg-white px-1 py-1 text-sm font-semibold text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 transition-all duration-100 hover:bg-gray-50 focus:z-10">
            <ChevronDoubleRightIcon
              className="h-3 w-3 transform-gpu rounded-full text-gray-400"
              style={{ transform: `rotate(${angle}deg)` }}
              aria-hidden="true"
            />
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default TransfershipEdge;
