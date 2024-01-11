import { FC, useContext } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

import TransfershipEdgeStates from "./states";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "reactflow";

import { Colors, ColorMap } from "../../../../../utils/colors";

import { GraphContext } from "../../../Graph";

const TransfershipEdge: FC<EdgeProps> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
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

  const { isAddressFocused, setEdgeState } = useContext(GraphContext);

  const volume: number = data?.volume ?? 0;
  const state: TransfershipEdgeStates =
    data?.state ?? TransfershipEdgeStates.HIDDEN;

  // Pick a color and icon - Either it's infrared and can be revealed or it's gray and should be hidden
  const ColorInfo =
    ColorMap[
      state === TransfershipEdgeStates.HIDDEN ? Colors.RED : Colors.GRAY
    ];
  const Icon = state === TransfershipEdgeStates.HIDDEN ? PlusIcon : MinusIcon;

  // Calculate the angle of the edge (in degrees)
  //const angle = Math.round(
  //  Math.atan2(targetY - sourceY, targetX - sourceX) * (180 / Math.PI),
  //);

  // If hidden, only show revealed edges
  if (state === TransfershipEdgeStates.HIDDEN) {
    const sourceIsFocused: boolean = isAddressFocused(source);
    const targetIsFocused: boolean = isAddressFocused(target);

    const anyAddressFocused: boolean = sourceIsFocused || targetIsFocused;
    if (!anyAddressFocused) {
      return null;
    }
  }

  const style = {
    strokeWidth: 1,
    stroke: state === TransfershipEdgeStates.HIDDEN ? "#f87171" : "#9ca3af",
  };

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
          <div
            className={clsx(
              "relative inline-flex items-center gap-x-1.5 rounded-full px-1 py-1 text-sm font-semibold  shadow-md ring-1 ring-inset  transition-all duration-100 focus:z-10",
              ColorInfo.background,
              ColorInfo.ring,
              ColorInfo.text,
            )}
            onClick={() => {
              setEdgeState(
                id,
                state === TransfershipEdgeStates.HIDDEN
                  ? TransfershipEdgeStates.REVEALED
                  : TransfershipEdgeStates.HIDDEN,
              );
            }}
          >
            <Icon
              className="h-3 w-3 transform-gpu rounded-full text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default TransfershipEdge;
