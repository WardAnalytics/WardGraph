export interface RiskLevelColors {
  riskFloor: number; // How low the risk needs to be for this level to be applicable

  backgroundColor: string; // Background color for the risk level
  hoveredBackgroundColor: string; // Background color for the risk level when hovered
  textColor: string; // Text color for the risk level
  ringColor: string; // Ring color for the risk level
  shadowColor: string; // Shadow color for the risk level

  fillColor: string; // Fill color for the risk level
  strokeColor: string; // Stroke color for the risk level
}

const LOW: RiskLevelColors = {
  riskFloor: 0,
  backgroundColor: "bg-green-50",
  hoveredBackgroundColor: "hover:bg-green-100",
  textColor: "text-green-700",
  ringColor: "ring-green-600/20",
  shadowColor: "shadow-green-600/50",
  fillColor: "fill-green-400",
  strokeColor: "stroke-green-400",
};

const MEDIUM: RiskLevelColors = {
  riskFloor: 2.5,
  backgroundColor: "bg-yellow-50",
  hoveredBackgroundColor: "hover:bg-yellow-100",
  textColor: "text-yellow-800",
  ringColor: "ring-yellow-600/20",
  shadowColor: "shadow-yellow-600/50",
  fillColor: "fill-yellow-400",
  strokeColor: "stroke-yellow-400",
};

const HIGH: RiskLevelColors = {
  riskFloor: 5,
  backgroundColor: "bg-orange-100",
  hoveredBackgroundColor: "hover:bg-orange-200",
  textColor: "text-orange-800",
  ringColor: "ring-orange-600/20",
  shadowColor: "shadow-orange-600/50",
  fillColor: "fill-orange-400",
  strokeColor: "stroke-orange-400",
};

const SEVERE: RiskLevelColors = {
  riskFloor: 7.5,
  backgroundColor: "bg-red-100",
  hoveredBackgroundColor: "hover:bg-red-200",
  textColor: "text-red-800",
  ringColor: "ring-red-600/20",
  shadowColor: "shadow-red-600/50",
  fillColor: "fill-red-400",
  strokeColor: "stroke-red-400",
};

const RISK_LEVELS: RiskLevelColors[] = [SEVERE, HIGH, MEDIUM, LOW];

/** Get the colors for a risk level
 * @param risk The risk level to get the color for
 * @returns A RiskLevelColors object that corresponds to the risk level and contains info for the color of the risk level
 */
export function getRiskLevelColors(risk: number): RiskLevelColors {
  return RISK_LEVELS.find((level) => risk >= level.riskFloor) || LOW;
}
