import {
  doc,
  onSnapshot,
  setDoc,
  collection,
  CollectionReference,
  Timestamp,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { v4 } from "uuid";
import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { GraphNotFoundError } from ".";
import { USERS_COLLECTION } from "../constants";

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
  data: PersonalGraphInfo;
  created_at?: Timestamp;
  last_modified?: Timestamp;
  uid?: string;
}

export function getGraphHref(graph: PersonalGraph) {
  return `/saved-graph/${graph.uid}`;
}

/** Creates a new personal graph for the user.
 * @param PersonalGraph The graph to create
 */
export async function createPersonalGraph(
  userID: string,
  graph: PersonalGraph,
): Promise<string> {
  // Set the created_at and last_modified fields
  graph.created_at = Timestamp.now();
  graph.last_modified = Timestamp.now();
  graph.uid = v4();

  // Get user snapshot
  const docRef = doc(db, USERS_COLLECTION, userID, "graphs", graph.uid!);

  // Update data
  await setDoc(docRef, graph);

  // Returns the unique ID of the graph
  return graph.uid;
}

/** Updates the personal graph data for the user.
 * @param graph The graph to update
 */
export async function updatePersonalGraph(
  userID: string,
  graph: PersonalGraph,
) {
  // Get user snapshot
  const docRef = doc(db, USERS_COLLECTION, userID, "graphs", graph.uid!);

  // Update the last_modified field
  graph.last_modified = Timestamp.now();

  // Update data
  await setDoc(docRef, graph, { merge: true });
}

/** Removes a personal graph for the user.
 * @param name The name of the graph to delete
 */
export async function removePersonalGraph(userID: string, uid: string) {
  // Get user snapshot
  const docRef = doc(db, USERS_COLLECTION, userID, "graphs", uid);

  // Update data
  await deleteDoc(docRef);
}

/** Retrieves the user's personal graphs from the database. Whenever the graphs are updated,
 * the returned graphs will be updated as well.
 * @returns The user's personal graphs, a loading state, and an error state
 */
export const usePersonalGraphs = (userID: string) => {
  const [graphs, setGraphs] = useState<PersonalGraph[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ref: CollectionReference | null;

    try {
      ref = collection(db, USERS_COLLECTION, userID, "graphs");
    } catch (error) {
      setLoading(false);
      setError(error as Error);
      return;
    }

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const newGraphs: PersonalGraph[] = [];
        snapshot.forEach((doc) => {
          newGraphs.push(doc.data() as PersonalGraph);
        });

        // Sort the graphs by last modified
        newGraphs.sort((a, b) => {
          return b.last_modified!.seconds - a.last_modified!.seconds;
        });

        setGraphs(newGraphs);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        setError(error);
      },
    );

    return () => unsubscribe();
  }, []);

  return { graphs, loading, error };
};

/** Retrieves a single personal graph by ID */
export async function getPersonalGraph(
  userID: string,
  uid: string,
): Promise<PersonalGraph> {
  const docRef = doc(db, USERS_COLLECTION, userID, "graphs", uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new GraphNotFoundError(uid);
  }

  return docSnap.data() as PersonalGraph;
}
