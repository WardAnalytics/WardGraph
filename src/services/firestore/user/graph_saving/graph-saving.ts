import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";

import { GraphNameNotUniqueError, GraphNotFoundError } from "./errors";
import { getVerifiedUser } from "../../../auth/auth.services";

/** The information pertaining to a personal graph.
 * - **addresses**: The addresses in the graph
 * - **edges**: The edges between the addresses
 * - **tags**: The tags for the addresses
 * - **averageRisk**: The average risk of the graph
 * - **totalVolume**: The total volume of the graph
 */
export interface PersonalGraphInfo {
  addresses: string[];
  edges: string[];
  tags: string[];
  averageRisk: number;
  totalVolume: number;
}

/** The information pertaining to a personal graph.
 * - **name**: The name of the graph
 * - **user**: The user ID of the graph
 * - **created_at**: The date the graph was created
 * - **last_modified**: The date the graph was last modified
 * - **data**: The graph data
 */
export interface PersonalGraph {
  name: string;
  user: string;
  created_at: Date;
  last_modified: Date;
  data: PersonalGraphInfo;
}

/** Checks if a graph name is unique for a user.
 *
 * @param userID The user ID to check for
 * @param graphName The graph name to check for
 * @returns `true` if the graph name is unique, `false` otherwise
 */
async function isGraphNameUnique(userID: string, graphName: string) {
  const q = query(
    collection(db, "users", userID, "graphs"),
    where("name", "==", graphName),
    limit(1),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
}

/** Stores a personal graph in the database.
 * - If **create** is set to `true`, uniqueness will be checked and the
 * graph will be created, else it throws an error.
 * - If **create** is set to `false`, the graph will be updated instead.
 *
 * This function also updates the "last_modified" field property automatically.
 *
 * @param graph The graph object to store
 * @param create Whether to create a new graph or update an existing one (default: false)
 */
export async function storePersonalGraph(
  graph: PersonalGraph,
  create: boolean = false,
) {
  const user = getVerifiedUser();

  // Assure the graph is unique for that user if we're creating it (not updating)
  if (create && !(await isGraphNameUnique(user.uid, graph.name))) {
    throw new GraphNameNotUniqueError(
      "Graph name " + graph.name + " is not unique for this user",
    );
  }

  // Update the last modified date
  await addDoc(collection(db, "users", user.uid, "graphs"), {
    name: graph.name,
    user: user.uid,
    created_at: graph.created_at,
    last_modified: new Date(),
    graphData: graph.data,
  });
}

/** Retrieves all personal graphs from the database for the current user.
 * @returns An array of all personal graphs for the current user.
 */
export async function getPersonalGraphs(): Promise<PersonalGraph[]> {
  const user = getVerifiedUser();

  // Get all personal graphs for the user
  const q = query(collection(db, "users", user.uid, "graphs"));
  const querySnapshot = await getDocs(q);
  const graphs: PersonalGraph[] = [];
  querySnapshot.forEach((doc) => {
    graphs.push(doc.data().graphData);
  });

  const orderedGraphs = graphs.sort((a, b) => {
    return a.last_modified < b.last_modified ? 1 : -1;
  });

  return orderedGraphs;
}

/** Retrieves the information for a specific graph by name
 * @param graphName The name of the graph to retrieve
 * @returns The graph object
 * @throws {GraphNotFoundError} If the graph is not found
 */
export async function getPersonalGraph(
  graphName: string,
): Promise<PersonalGraph> {
  const user = getVerifiedUser();

  // Get the graph for the user
  const q = query(
    collection(db, "users", user.uid, "graphs"),
    where("name", "==", graphName),
    limit(1),
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    throw new GraphNotFoundError("Graph " + graphName + " not found");
  }

  const graph: PersonalGraph = querySnapshot.docs[0].data().graphData;
  return graph;
}
