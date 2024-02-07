/** Enum for the states of the address node.
 * There are three possible statees:
 * - MINIMIZED: The address has been inspected and is now a small square node on the graphç
 * - EXPANDED: The address is fully focused and is a large node on the graph displaying all of the analysis information
 */

enum AddressNodeStates {
  MINIMIZED = "MINIMIZED",
  EXPANDED = "EXPANDED",
}

export default AddressNodeStates;
