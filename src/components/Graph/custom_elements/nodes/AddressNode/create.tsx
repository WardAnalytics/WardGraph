import AddressNodeState from "./states";
import { Node } from "reactflow";

export default function createAddressNode(
  address: string,
  initialState: AddressNodeState = AddressNodeState.MINIMIZED,
  x: number = 0,
  y: number = 0,
): Node {
  const lowerCaseAddress = address.toLowerCase();
  const data = { address: lowerCaseAddress, initialState };
  const position = { x, y };

  return { id: lowerCaseAddress, data, type: "AddressNode", position };
}
