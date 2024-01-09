import Colors from "./enum";

interface ColorClass {
  text: string;
  background: string;
  ring: string;
}

export const ColorMap: Record<string, ColorClass> = {
  [Colors.BLUE]: {
    text: "text-blue-700",
    background: "bg-blue-50",
    ring: "ring-blue-700/10",
  },
  [Colors.RED]: {
    text: "text-red-700",
    background: "bg-red-50",
    ring: "ring-red-700/10",
  },
  [Colors.ORANGE]: {
    text: "text-orange-700",
    background: "bg-orange-50",
    ring: "ring-orange-700/10",
  },
  [Colors.YELLOW]: {
    text: "text-yellow-700",
    background: "bg-yellow-50",
    ring: "ring-yellow-700/10",
  },
  [Colors.GREEN]: {
    text: "text-green-700",
    background: "bg-green-50",
    ring: "ring-green-700/10",
  },
  [Colors.GRAY]: {
    text: "text-gray-700",
    background: "bg-gray-50",
    ring: "ring-gray-700/10",
  },
  [Colors.PURPLE]: {
    text: "text-purple-700",
    background: "bg-purple-50",
    ring: "ring-purple-700/10",
  },
  [Colors.WHITE]: {
    text: "text-gray-700",
    background: "bg-white",
    ring: "ring-gray-700/10",
  },
};

export default ColorMap;
export type { ColorClass };
