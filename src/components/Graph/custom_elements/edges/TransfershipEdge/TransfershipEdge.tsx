import { FC, useContext, useCallback } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  useStore,
  getBezierPath,
} from "reactflow";
import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";

import CustomEdgePath from "./CustomEdgePath";
import TransfershipEdgeStates from "./states";
import { GraphContext } from "../../../Graph";
import { Colors, ColorMap } from "../../../../../utils/colors";

const TransfershipEdge: FC<EdgeProps> = ({
  id,
  source,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  target,
  data,
  markerEnd,
}: EdgeProps) => {
  // Whether the edge is hidden or revealded ------------------------------

  const {
    isAddressFocused,
    setEdgeState,
    getEdgeVolumeScale,
    getEdgeHandleID,
  } = useContext(GraphContext);
  const isHidden: boolean = data?.state === TransfershipEdgeStates.HIDDEN;

  // If hidden, check whether the source or target node is focused. If none are focused, don't render the edge at all
  if (isHidden) {
    const sourceIsFocused: boolean = isAddressFocused(source);
    const targetIsFocused: boolean = isAddressFocused(target);

    const anyAddressFocused: boolean = sourceIsFocused || targetIsFocused;
    if (!anyAddressFocused) {
      return null;
    }
  }

  // Pick a color and icon - Either it's infrared and can be revealed or it's gray and should be hidden
  const volume: number = data?.volume ?? 0;
  const ColorInfo = ColorMap[isHidden ? Colors.RED : Colors.GRAY];
  const Icon = isHidden ? PlusIcon : MinusIcon;

  // Width starts at 1 and goes up to 9 based on the volume transfered
  const width: number = Math.min(0.5 + getEdgeVolumeScale(volume) * 6, 6.5);
  const opacity: number = 0.65 + getEdgeVolumeScale(volume) * 0.35;
  const style = {
    strokeWidth: width,
    stroke: isHidden ? "#60a5fa" : "#9ca3af",
    strokeOpacity: opacity,
    transition: "stroke 0.5s",
    animation: isHidden
      ? "pulse 2s cubic-bezier(0.4, 0, 0.8, 1) infinite"
      : "none",
  };

  const hoveredStyle = {
    stroke: isHidden ? "#60a5fa" : "#9ca3af",
    transition: "stroke 0.5s, opacity 0.2s ease-out",
  };

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <CustomEdgePath
        id={id}
        edgeHandleID={getEdgeHandleID(id)}
        path={edgePath}
        style={style}
        strokeWidth={width}
        hoveredStyle={hoveredStyle}
        onClick={() => {
          setEdgeState(
            id,
            isHidden
              ? TransfershipEdgeStates.REVEALED
              : TransfershipEdgeStates.HIDDEN,
          );
        }}
      />
    </>
  );
};

export default TransfershipEdge;
