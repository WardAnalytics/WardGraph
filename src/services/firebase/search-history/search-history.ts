import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import authService from "../../auth/auth.services";

export interface AddressHistoryAPIObject {
  address: string;
  user?: string;
  created_at: Date;
}

const user = authService.getCurrentUser();

/**
 * Stores the address searched in the database
 *
 * @param address
 * @returns
 */
const StoreAddress = async (address: string) => {
  try {
    const newAddressObject: AddressHistoryAPIObject = {
      address,
      user: user?.uid,
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
 * @returns
 */
const GetUserHistory = async () => {
  // TODO: get the user from the auth context
  const userId = user?.uid;
  const q = query(collection(db, "searchHistory"), where("user", "==", userId));

  const querySnapshot = await getDocs(q);

  const addresses: AddressHistoryAPIObject[] = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    const data = doc.data() as AddressHistoryAPIObject;

    addresses.push(data);
  });

  return addresses;
};

/**
 * Get address search history from the database
 *
 * @param address The address to search for
 * @returns The search history for the address
 */
const GetAddressHistory = async (address: string) => {
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

export default {
  StoreAddress,
  GetUserHistory,
  GetAddressHistory,
};
