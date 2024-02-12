import { CollectionReference, collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { UserNotFoundError } from "../errors";

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
      setError(new UserNotFoundError(userID));
      return;
    }

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        let isPremium = false;
        if (docSnap.docs.length === 0) {
          isPremium = false;
        } else {
          isPremium = true;
        }
        setIsPremium(isPremium);
        localStorage.setItem("isPremium", JSON.stringify(isPremium));
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
