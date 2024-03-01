import clsx from "clsx";
import { CSSProperties, useMemo } from "react";
import { RiskLevelColors } from "../../../../../utils/risk_levels";

import "./CustomEdgePath.css";
import { max } from "lodash";

interface CustomEdgePathProps {
  id?: string;
  path: string;
  style?: CSSProperties;
  strokeWidth: number;
  onClick?: () => void;
  onContextMenu?: () => void;
  onMouseEnter?: (e: any) => void;
  onMouseLeave?: () => void;
  onMouseMove?: (e: any) => void;
  edgeHandleID: string;
  isHidden: boolean;
  opacity: number;
  isClickable: boolean;
  riskVisionColors: RiskLevelColors | null;
}

const CustomEdgePath = ({
  id,
  path,
  strokeWidth,
  opacity,
  edgeHandleID,
  isHidden,
  isClickable,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onContextMenu,
  riskVisionColors,
}: CustomEdgePathProps) => {
  const triangleMarkerID: string = `triangle-${id}`;

  // Create a delay for the animation picked at random between 0 and 5 seconds. It should only be calculated once
  const { delay } = useMemo(() => {
    return {
      delay: Math.random() * 5,
    };
  }, []);

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
          strokeWidth={Math.min(strokeWidth * 15, 20)}
          className="react-flow__edge-interaction opacity-0 hover:animate-pulse hover:cursor-pointer hover:opacity-90"
          style={{
            strokeLinecap: "round",
            strokeLinejoin: "round",
            stroke: isHidden ? "#60a5fa" : "#9ca3af",
            transition: "stroke 0.5s, opacity 0.2s ease-out",
          }}
          onClick={onClick}
          onContextMenu={onContextMenu}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseEnter}
        />
      )}
      <circle
        className={clsx(
          riskVisionColors
            ? riskVisionColors.fillColor
            : edgeHandleID === "a"
              ? "fill-blue-400"
              : "fill-orange-400",
        )}
        cx="0"
        cy="0"
        r={max([strokeWidth * 2, 2.5])}
      >
        <animateMotion
          dur="4.5s"
          repeatCount="indefinite"
          path={path}
          rotate="auto"
          begin={`${delay}s`}
        />
      </circle>
      <circle
        className={clsx(
          "animate-ping",
          riskVisionColors
            ? riskVisionColors.fillColor
            : edgeHandleID === "a"
              ? "fill-blue-400"
              : "fill-orange-400",
        )}
        cx="0"
        cy="0"
        r={max([strokeWidth * 2, 1.5])}
      >
        <animateMotion
          dur="4.5s"
          repeatCount="indefinite"
          path={path}
          rotate="auto"
          begin={`${delay}s`}
        />
      </circle>
    </>
  );
};

CustomEdgePath.displayName = "CustomEdgePath";

export default CustomEdgePath;
