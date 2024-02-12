import { CollectionReference, collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";

/** Checks if the user has a premium subscription.
 * Whenever the user's premium status is updated, the returned status will be updated as well.
 * @param userID The user ID to check
 * @returns The user's premium status, a loading state, and an error state
 */
export const usePremiumStatus = (userID: string) => {
  const localIsPremium = localStorage.getItem("isPremium");
  const initialIsPremium = localIsPremium ? JSON.parse(localIsPremium) : false;

  const [isPremium, setIsPremium] = useState<boolean>(initialIsPremium);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);


  useEffect(() => {
    let docRef: CollectionReference | null = null;

    try {
      docRef = collection(db, "customers", userID, "subscriptions");
    } catch (error) {
      setLoading(false);
      setError(error as Error);
      return;
    }

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.docs.length === 0) {
          setIsPremium(false);
        } else {
          setIsPremium(true);
        }

        setLoading(false);
      },
      (error) => {
        setLoading(false);
        setError(error as Error);
      });

    return () => unsubscribe();
  }, [userID]);

  return { isPremium, loading, error };
}
