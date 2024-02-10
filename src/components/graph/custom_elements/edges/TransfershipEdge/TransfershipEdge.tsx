import { FC, useContext } from "react";
import { EdgeProps, getBezierPath } from "reactflow";

import CustomEdgePath from "../TransfershipEdge/CustomEdgePath";
import TransfershipEdgeStates from "../TransfershipEdge/states";
import { GraphContext } from "../../../Graph";

export interface RiskVisionColors {
  fillColor: string;
  strokeColor: string;
}

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
}: EdgeProps) => {
  // Whether the edge is hidden or revealded ------------------------------

  const {
    setEdgeState,
    getEdgeVolumeScale,
    getEdgeHandleID,
    setHoveredTransferData,
    focusedAddressData,
    getAddressRisk,
    isRiskVision,
  } = useContext(GraphContext);
  const isHidden: boolean = data?.state === TransfershipEdgeStates.HIDDEN;

  // If there is a risk vision, get the risk of the source and target addresses. Set the colors of the edges to reflect the highest risk of both
  let riskVisionColors: undefined | RiskVisionColors = undefined;
  if (isRiskVision) {
    const sourceRisk = getAddressRisk(source);
    const targetRisk = getAddressRisk(target);
    const highestRisk = Math.max(sourceRisk, targetRisk);

    riskVisionColors = {
      fillColor: "fill-green-400",
      strokeColor: "stroke-green-400",
    };

    if (highestRisk >= 4) {
      riskVisionColors = {
        fillColor: "fill-yellow-400",
        strokeColor: "stroke-yellow-400",
      };
    }

    if (highestRisk >= 7) {
      riskVisionColors = {
        fillColor: "fill-red-400",
        strokeColor: "stroke-red-400",
      };
    }

    if (highestRisk >= 9) {
      riskVisionColors = {
        fillColor: "fill-red-700",
        strokeColor: "stroke-red-700",
      };
    }
  }

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
        riskVisionColors={riskVisionColors}
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
