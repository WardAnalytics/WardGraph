import AddressNodeState from "./states";
import { Node } from "reactflow";

export default function createAddressNode(
  address: string,
  state: AddressNodeState = AddressNodeState.MINIMIZED,
  highlight: boolean = true,
  x: number = 0,
  y: number = 0,
): Node {
  const lowerCaseAddress = address.toLowerCase();
  const data = { address: lowerCaseAddress, state, highlight };
  const position = { x, y };

  return { id: lowerCaseAddress, data, type: "AddressNode", position };
}