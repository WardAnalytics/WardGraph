import { doc, setDoc, getDoc } from "firebase/firestore";
import { v4 } from "uuid";

import { db } from "../../firebase";
import { GraphNotFoundError } from "./errors";

/* This is a system of creating share-links using firestore. Each document has an UID that identifies it in the "sharableGraphs" collection. 
 * Each sharable graph then has two lists of strings: addresses and edges. These lists are used to create the graph.
  Two functions are required:
  1. createSharableGraph - creates a new sharable graph for the user with a random UUID. Returns the UUID.
  2. getSharableGraph - retrieves the sharable graph from the database. Doesn't need to update in real time as sharableGraphs never change once created.
*/

/** The information pertaining to a sharable graph.
 * - **addresses**: The addresses in the graph "0x123"
 * - **edges**: The edges between the addresses "0x123->0x456"
 */
export interface SharableGraph {
  addresses: string[];
  edges: string[];
}

/** Creates a new sharable graph for the user. Returns the UUID of the graph.
 * @param graph The graph to create
 * @returns The UUID of the graph
 */
export async function createSharableGraph(graph: SharableGraph) {
  // Generate a UUID for the graph
  const graphID = v4();

  // Now set the graph in the sharableGraphs collection
  const ref = doc(db, "sharableGraphs", graphID);
  setDoc(ref, graph).catch((error) => {
    console.error("Error writing document: ", error);
  });

  return graphID;
}

/** Retrieves the sharable graph from the database.
 * @param graphID The UUID of the graph
 * @returns The graph
 * @throws {GraphNotFoundError} If the graph is not found
 */
export async function getSharableGraph(
  graphID: string,
): Promise<SharableGraph> {
  const ref = doc(db, "sharableGraphs", graphID);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data() as SharableGraph;
  } else {
    throw new GraphNotFoundError(graphID);
  }
}
