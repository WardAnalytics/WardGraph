import { collection, onSnapshot, query, where } from "firebase/firestore";
import authService from "../../auth/auth.services";
import { db } from "../../firebase";

const getPremiumStatus = async () => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return false;
  }

  const user = authService.getCurrentUser();

  if (!user) {
    return false;
  }

  const userId = user.uid;

  const subscriptionsRef = collection(db, "customers", userId, "subscriptions");

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

export { getPremiumStatus };
