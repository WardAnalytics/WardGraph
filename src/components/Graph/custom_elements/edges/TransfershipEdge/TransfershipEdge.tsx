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
    setHoveredTransferData,
    focusedAddressData,
  } = useContext(GraphContext);
  const isHidden: boolean = data?.state === TransfershipEdgeStates.HIDDEN;

  // If hidden, check whether the source or target node is focused. If none are focused, don't render the edge at all
  if (
    isHidden &&
    focusedAddressData?.address !== source &&
    focusedAddressData?.address !== target
  ) {
    return null;
  }

  // Pick a color and icon - Either it's infrared and can be revealed or it's gray and should be hidden
  const volume: number = data?.volume ?? 0;
  const ColorInfo = ColorMap[isHidden ? Colors.RED : Colors.GRAY];
  const Icon = isHidden ? PlusIcon : MinusIcon;

  // Width starts at 1 and goes up to 9 based on the volume transfered
  const volumeScale: number = getEdgeVolumeScale(volume);
  let width: number = Math.min(0.5 + volumeScale * 6, 6.5);
  let opacity: number = 0.65 + volumeScale * 0.35;
  let isClickable: boolean = true;

  // If an address is focused and this edge is not connected to it, make it more transparent
  if (focusedAddressData !== null) {
    if (
      source !== focusedAddressData.address &&
      target !== focusedAddressData.address
    ) {
      opacity = 0.1;
      isClickable = false;
    } else {
      opacity = 1;
      width = Math.max(width, 1.5) * 1.25;
    }
  }

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
        strokeWidth={width}
        opacity={opacity}
        hoveredStyle={hoveredStyle}
        isHidden={isHidden}
        isClickable={isClickable}
        onClick={() => {
          setEdgeState(
            id,
            isHidden
              ? TransfershipEdgeStates.REVEALED
              : TransfershipEdgeStates.HIDDEN,
          );
        }}
        onMouseEnter={() => {
          setHoveredTransferData({
            source,
            target,
            volume,
          });
        }}
        onMouseLeave={() => setHoveredTransferData(null)}
      />
    </>
  );
};

export default TransfershipEdge;
