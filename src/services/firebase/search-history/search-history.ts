import {
  collection,
  doc,
  getDocs,
  limitToLast,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import authService from "../../auth/auth.services";
import { db } from "../firebase";

export interface AddressHistoryAPIObject {
  address: string;
  user?: string;
  created_at: Date;
}

/**
 * Stores the address searched in the database
 *
 * @param address
 * @returns The address that was stored
 */
const storeAddress = async (address: string, userId?: string) => {
  try {
    const newAddressObject: AddressHistoryAPIObject = {
      address,
      user: userId,
      created_at: new Date(),
    };

    // TODO: store the user that performed the search as well, if logged in
    await setDoc(doc(collection(db, "searchHistory")), newAddressObject);

    console.log("Address stored in the database", address);

    return address;
  } catch (e) {
    console.error(e);
  }
};

/**
 * Get user search history from the database
 *
 * @returns The search history for the user
 */
const getUserHistory = async (userId?: string, recordLimit: number = 5) => {
  console.log("userId", userId);

  if (!userId) {
    return [];
  }

  const q = query(
    collection(db, "searchHistory"),
    where("user", "==", userId),
    orderBy("created_at", "desc"),
    limitToLast(recordLimit),
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return [];
  }

  const addresses: string[] = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    const data = doc.data() as AddressHistoryAPIObject;

    addresses.push(data.address);
  });

  return addresses;
};

/**
 * Get address search history from the database
 *
 * @param address The address to search for
 * @returns The search history for the address
 */
const getAddressHistory = async (address: string) => {
  const q = query(
    collection(db, "searchHistory"),
    where("address", "==", address),
  );

  const querySnapshot = await getDocs(q);

  const addresses: AddressHistoryAPIObject[] = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    const data = doc.data() as AddressHistoryAPIObject;

    addresses.push(data);
  });

  return addresses;
};

export { getAddressHistory, getUserHistory, storeAddress };
