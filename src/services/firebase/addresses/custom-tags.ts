import {
  collection,
  doc,
  getDocs,
  query,
  addDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import authService from "../../auth/auth.services";
import { db } from "../firebase";

export interface UserCustomAddressTag {
  address: string;
  user?: string;
  tags: string[];
  created_at: Date;
}

const user = authService.getCurrentUser();

/**
 * Get user custom addresses tags
 *
 * @param address - address to get tags
 * @returns - tags of address
 */
const getCustomAddressesTags = async (address: string): Promise<string[]> => {
  try {
    const q = query(
      collection(db, "customAddressesTags"),
      where("address", "==", address),
      where("user", "==", user?.uid),
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => doc.data().tags);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Store user custom addresses tags if not exists
 * If exists, update tags
 *
 * @param address - address to store tags
 * @param tags - tags to store
 */
const storeCustomAddressesTags = async (address: string, tags: string[]) => {
  let q;
  try {
    q = query(
      collection(db, "customAddressesTags"),
      where("address", "==", address),
      where("user", "==", user?.uid),
    );
  } catch (error) {
    console.log(error);
  }
  const querySnapshot = q ? await getDocs(q) : undefined;

  if (querySnapshot && !querySnapshot.empty) {
    const docRef = doc(db, "customAddressesTags", querySnapshot.docs[0].id);
    await updateDoc(docRef, {
      tags,
    });
  } else {
    await addDoc(collection(db, "customAddressesTags"), {
      address,
      user: user?.uid,
      tags,
      created_at: new Date(),
    });
  }
};

export default {
  getCustomAddressesTags,
  storeCustomAddressesTags,
};
