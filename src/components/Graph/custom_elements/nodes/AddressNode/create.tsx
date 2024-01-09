import { Node } from "reactflow";
import AddressNodeState from "./states";

export default function createAddressNode(
  address: string,
  state: AddressNodeState = AddressNodeState.MINIMIZED,
  x: number = 0,
  y: number = 0,
): Node {
  const lowerCaseAddress = address.toLowerCase();
  const data = { address: lowerCaseAddress, state };
  const position = { x, y };

  return { id: lowerCaseAddress, data, type: "AddressNode", position };
}
