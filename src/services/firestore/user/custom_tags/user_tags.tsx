import {
  getDoc,
  doc,
  onSnapshot,
  DocumentReference,
  arrayRemove,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { getVerifiedUser } from "../../../auth/auth.services";
import { db } from "../../../firebase";

import { UserNotFoundError } from "../errors";
import { UserData } from "../types";

/** Adds a custom tag to a user's custom tags. Always add it to the start of the array.
 * - If it already exists, move it to the start instead.
 * - If the user's customTags doesn't exist, create it.
 * @param tag The tag to add
 */
export async function addCustomUserTag(tag: string) {
  const user = getVerifiedUser();

  // Get user snapshot
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  // If the user doesn't exist, throw an error
  if (!docSnap.exists()) {
    throw new UserNotFoundError(user.uid);
  }

  // Update data
  await setDoc(docRef, { customTags: arrayUnion(tag) }, { merge: true });
}

/** Removes a custom tag from a user's custom tags.
 * @param tag
 */
export async function removeCustomUserTag(tag: string) {
  const user = getVerifiedUser();

  // Get user snapshot
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  // If the user doesn't exist, throw an error
  if (!docSnap.exists()) {
    throw new UserNotFoundError(user.uid);
  }

  // Modify data using arrayRemove
  await setDoc(docRef, { customTags: arrayRemove(tag) }, { merge: true });
}

/** Retrieves the user's custom tags from the database. Whenever the tags are updated,
 * the returned tags will be updated as well.
 * @returns The user's custom tags, a loading state, and an error state
 */
export const useCustomUserTags = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let docRef: DocumentReference | null = null;
    let userID: string | null = null;

    try {
      userID = getVerifiedUser().uid;
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
