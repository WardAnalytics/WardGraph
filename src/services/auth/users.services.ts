import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import authService from "./auth.services";

/**
 * Get if user is premium
 *
 * @returns True if user is premium, false otherwise
 */

const getIsPremiumUser = async (): Promise<boolean> => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return false;
  }

  const uid = authService.getCurrentUser()?.uid;

  if (!uid) {
    return false;
  }

  const docRef = collection(db, "customers", `${uid}`, "subscriptions");
  const q = query(docRef, where("status", "==", "active"));

  const docSnap = await getDocs(q);

  if (docSnap.empty) {
    return false;
  }

  return true;
};

export { getIsPremiumUser };
