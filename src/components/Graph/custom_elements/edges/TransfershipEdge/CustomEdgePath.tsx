import { CSSProperties, FC } from "react";
import { MarkerType } from "reactflow";
import clsx from "clsx";

import "./CustomEdgePath.css";

interface CustomEdgePathProps {
  id?: string;
  path: string;
  style?: CSSProperties;
  strokeWidth: number;
  hoveredStyle?: CSSProperties;
  onClick?: () => void;
  edgeHandleID: string;
}

const CustomEdgePath = ({
  id,
  path,
  strokeWidth,
  hoveredStyle,
  edgeHandleID,
  onClick,
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
            edgeHandleID === "a" ? "fill-blue-400" : "fill-orange-400",
          )}
        />
        <circle
          cx="10"
          cy="10"
          r="10"
          className={clsx(
            "animate-pulse opacity-10",
            edgeHandleID === "a" ? "fill-blue-400" : "fill-orange-400",
          )}
        />
      </marker>

      <path
        id={id}
        d={path}
        fill="none"
        className={clsx(
          "animated-dotted-line",
          edgeHandleID === "a" ? "stroke-blue-400" : "stroke-orange-400",
        )}
        strokeWidth={strokeWidth}
        markerEnd={`url(#${triangleMarkerID})`}
      />
      <path
        id={id}
        d={path}
        fill="none"
        className={clsx(
          "animate-pulse opacity-80",
          edgeHandleID === "a" ? "stroke-blue-400" : "stroke-orange-400",
        )}
        strokeWidth={strokeWidth * 1.1}
      />
      <path
        d={path}
        fill="none"
        style={hoveredStyle}
        strokeWidth={10}
        className="react-flow__edge-interaction opacity-0 hover:animate-pulse hover:cursor-pointer hover:opacity-90"
        onClick={onClick}
      />
    </>
  );
};

CustomEdgePath.displayName = "CustomEdgePath";

export default CustomEdgePath;
