import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

/** Checks if the user has a premium subscription.
 * This function checks the status of the user's subscription from the stripe database.
 * @param userID The user ID to check
 * @returns A promise that resolves to true if the user has a premium subscription, and false otherwise
 */
export const getPremiumStatus = async (userID: string) => {
  const subscriptionsRef = collection(db, "customers", userID, "subscriptions");

  const q = query(
    subscriptionsRef,
    where("status", "in", ["trialing", "active"]),
  );

  return new Promise<boolean>((resolve, reject) => {
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.docs.length === 0) {
          resolve(false);
        } else {
          resolve(true);
        }

        unsubscribe();
      },
      reject,
    );
  });
};
