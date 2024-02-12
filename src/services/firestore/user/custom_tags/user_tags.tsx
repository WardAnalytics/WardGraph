import {
  doc,
  onSnapshot,
  DocumentReference,
  arrayRemove,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../../../firebase";

import { UserNotFoundError } from "../errors";
import { UserData } from "../types";

/** Adds a custom tag to a user's custom tags. Always add it to the start of the array.
 * - If it already exists, move it to the start instead.
 * - If the user's customTags doesn't exist, create it.
 * @param tag The tag to add
 */
export async function addCustomUserTag(userID: string, tag: string) {
  // Get user snapshot
  const docRef = doc(db, "users", userID);

  // Update data
  await setDoc(docRef, { customTags: arrayUnion(tag) }, { merge: true });
}

/** Removes a custom tag from a user's custom tags.
 * @param tag
 */
export async function removeCustomUserTag(userID: string, tag: string) {
  // Get user snapshot
  const docRef = doc(db, "users", userID);

  // Modify data using arrayRemove
  await setDoc(docRef, { customTags: arrayRemove(tag) }, { merge: true });
}

/** Retrieves the user's custom tags from the database. Whenever the tags are updated,
 * the returned tags will be updated as well.
 * @returns The user's custom tags, a loading state, and an error state
 */
export const useCustomUserTags = (userID: string) => {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let docRef: DocumentReference | null = null;

    try {
      docRef = doc(db, "users", userID);
    } catch (error) {
      setLoading(false);
      setError(error as Error);
      return;
    }

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        // If it doesn't exist throw an error
        if (!docSnap.exists()) {
          setLoading(false);
          setError(new UserNotFoundError(userID!));
        } else {
          // Else, set data appropriately
          const userData = docSnap.data() as UserData;
          setTags(userData.customTags || []);
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        setError(error as Error);
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this effect runs only once upon mounting

  return { tags, loading, error };
};
