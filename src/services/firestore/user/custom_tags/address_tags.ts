import {
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

/** Adds a custom tag to a address' custom tags.
 * - If the address subcollection doesn't exist, create it.
 * - If the address document isn't in the subcollection, create it.
 * @param tag The tag to add
 */
export async function addCustomAddressTag(address: string, tag: string) {
  const user = getVerifiedUser();

  // Get user document ref
  const docRef = doc(db, "users", user.uid, "addressTags", address);

  // Update ite
  await setDoc(docRef, { tags: arrayUnion(tag) }, { merge: true });
}

/** Removes a custom tag from a address' custom tags.
 * @param tag
 */
export async function removeCustomAddressTag(address: string, tag: string) {
  const user = getVerifiedUser();

  // Get user document ref
  const docRef = doc(db, "users", user.uid, "addressTags", address);

  // Update it
  await setDoc(docRef, { tags: arrayRemove(tag) }, { merge: true });
}

/** Retrieves the user's custom tags from the database. Whenever the tags are updated,
 * the returned tags will be updated as well.
 * @returns The user's custom address tags, a loading state, and an error state
 */
export const useCustomAddressTags = ({ address }: { address: string }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let docRef: DocumentReference | null = null;
    let userID: string | null = null;

    try {
      userID = getVerifiedUser().uid;
      docRef = doc(db, "users", userID, "addressTags", address);
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
