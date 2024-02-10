import clsx from "clsx";
import { CSSProperties } from "react";
import { RiskVisionColors } from "./TransfershipEdge";

import "./CustomEdgePath.css";

interface CustomEdgePathProps {
  id?: string;
  path: string;
  style?: CSSProperties;
  strokeWidth: number;
  hoveredStyle?: CSSProperties;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  edgeHandleID: string;
  isHidden: boolean;
  opacity: number;
  isClickable: boolean;
  riskVisionColors?: RiskVisionColors;
}

const CustomEdgePath = ({
  id,
  path,
  strokeWidth,
  opacity,
  hoveredStyle,
  edgeHandleID,
  isHidden,
  isClickable,
  onMouseEnter,
  onMouseLeave,
  onClick,
  riskVisionColors,
}: CustomEdgePathProps) => {
  const triangleMarkerID: string = `triangle-${id}`;

  return (
    <>
      <marker
        id={triangleMarkerID}
        viewBox="0 0 20 20"
        refX="5"
        refY="10"
        markerUnits="strokeWidth"
        markerWidth="10"
        markerHeight="10"
        orient="auto"
      >
        <circle
          cx="10"
          cy="10"
          r="7"
          className={clsx(
            isHidden
              ? "fill-gray-300"
              : riskVisionColors
                ? riskVisionColors.fillColor
                : edgeHandleID === "a"
                  ? "fill-blue-400"
                  : "fill-orange-400",
          )}
        />
        <circle
          cx="10"
          cy="10"
          r="10"
          className={clsx(
            "animate-pulse opacity-10",
            isHidden
              ? "fill-gray-300"
              : riskVisionColors
                ? riskVisionColors.fillColor
                : edgeHandleID === "a"
                  ? "fill-blue-400"
                  : "fill-orange-400",
          )}
        />
      </marker>

      <path
        id={id}
        d={path}
        fill="none"
        className={clsx(
          "animated-dotted-line",
          isHidden
            ? "stroke-gray-300"
            : riskVisionColors
              ? riskVisionColors.strokeColor
              : edgeHandleID === "a"
                ? "stroke-blue-400"
                : "stroke-orange-400",
        )}
        strokeWidth={strokeWidth}
        markerEnd={`url(#${triangleMarkerID})`}
        opacity={opacity}
        style={{
          transition: "stroke-width 1s ease-in-out",
        }}
      />
      <path
        id={id}
        d={path}
        fill="none"
        className={clsx(
          isHidden
            ? "stroke-gray-300"
            : riskVisionColors
              ? riskVisionColors.strokeColor
              : edgeHandleID === "a"
                ? "stroke-blue-400"
                : "stroke-orange-400",
        )}
        strokeWidth={strokeWidth * 1.1}
        style={{
          transition: "stroke-width 1s ease-in-out",
        }}
        opacity={opacity * 0.8}
      />
      {isClickable && (
        <path
          d={path}
          fill="none"
          style={hoveredStyle}
          strokeWidth={Math.min(strokeWidth * 15, 20)}
          className="react-flow__edge-interaction opacity-0 hover:animate-pulse hover:cursor-pointer hover:opacity-90"
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      )}
    </>
  );
};

CustomEdgePath.displayName = "CustomEdgePath";

export default CustomEdgePath;
