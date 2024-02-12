import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  DocumentReference,
} from "firebase/firestore";

import { useState, useEffect } from "react";
import { UserNotFoundError } from "../errors";
import { db } from "../../../firebase";
import { UserData } from "../types";

// The maximum amount of search results to store in the user history
const USER_HISTORY_LIMIT = 5;

/** Stores the address searched in the database
 * @param address
 * @returns The address that was stored
 */
export async function storeSearchedAddress(userID: string, address: string) {
  const userRef = doc(db, "users", userID);
  let searchHistory: string[] = [];

  try {
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() as UserData;
    searchHistory = userData.searchHistory || [];
  } catch (error) {
    throw new UserNotFoundError(userID);
  }

  // Filter the address out, add it to the beginning, and remove all but the first USER_HISTORY_LIMIT addresses
  const newHistory = [
    address,
    ...searchHistory.filter((a) => a !== address),
  ].slice(0, USER_HISTORY_LIMIT);

  // Merge the new history into the user document
  await setDoc(userRef, { searchHistory: newHistory }, { merge: true });
}

/** Hook to get the search history in real time for the current user
 * @returns The search history, a loading state, and an error state
 */
export const useSearchHistory = (userID: string) => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
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
          setSearchHistory(userData.searchHistory || []);
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

  return { searchHistory, loading, error };
};
