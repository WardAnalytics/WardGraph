import AddressNodeState from "./states";
import { Node } from "reactflow";

export default function createAddressNode(
  address: string,
  state: AddressNodeState = AddressNodeState.MINIMIZED,
  highlight: boolean = true,
  x: number = 0,
  y: number = 0,
  expandAutomatically: boolean = false,
): Node {
  const lowerCaseAddress = address.toLowerCase();
  const data = {
    address: lowerCaseAddress,
    state,
    highlight,
    expandAutomatically,
  };
  const position = { x, y };

  return {
    id: lowerCaseAddress,
    data,
    type: "AddressNode",
    position,
  };
}
