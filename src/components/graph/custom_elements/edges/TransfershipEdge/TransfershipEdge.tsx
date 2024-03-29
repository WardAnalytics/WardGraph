import { FC, useContext, useMemo } from "react";
import { EdgeProps, getBezierPath } from "reactflow";

import CustomEdgePath from "../TransfershipEdge/CustomEdgePath";
import TransfershipEdgeStates from "../TransfershipEdge/states";
import { GraphContext } from "../../../Graph";

import { getRiskLevelColors } from "../../../../../utils/risk_levels";

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
    setFocusedEdgeData,
    focusedAddressData,
    getAddressRisk,
    isRiskVision,
  } = useContext(GraphContext);
  const isHidden: boolean = data?.state === TransfershipEdgeStates.HIDDEN;

  // If there is a risk vision, get the risk of the source and target addresses. Set the colors of the edges to reflect the highest risk of both
  const { riskVisionColors } = useMemo(() => {
    if (isRiskVision) {
      const sourceRisk = getAddressRisk(source);
      const targetRisk = getAddressRisk(target);
      const highestRisk = Math.max(sourceRisk, targetRisk);

      return { riskVisionColors: getRiskLevelColors(highestRisk) };
    }

    return { riskVisionColors: null };
  }, [isRiskVision, getAddressRisk, source, target]);

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

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleMouseMove = (e: any) => {
    setHoveredTransferData({
      source,
      target,
      volume,
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <>
      <CustomEdgePath
        id={id}
        edgeHandleID={getEdgeHandleID(id)}
        path={edgePath}
        strokeWidth={width}
        opacity={opacity}
        isHidden={isHidden}
        isClickable={isClickable}
        riskVisionColors={riskVisionColors}
        onContextMenu={() => {
          // Prevent the default context menu from showing

          setEdgeState(
            id,
            isHidden
              ? TransfershipEdgeStates.REVEALED
              : TransfershipEdgeStates.HIDDEN,
          );
          setHoveredTransferData(null);
          return false;
        }}
        onClick={() => {
          setHoveredTransferData(null);

          // Else, set the edge as focused
          setFocusedEdgeData({
            source,
            target,
            volume: 0,
            x: 0,
            y: 0,
          });
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseMove}
        onMouseLeave={() => setHoveredTransferData(null)}
      />
    </>
  );
};

export default TransfershipEdge;
