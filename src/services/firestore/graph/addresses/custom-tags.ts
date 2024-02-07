import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import authService from "../../../auth/auth.services";
import { db } from "../../../firebase";

export interface CustomAddressTag {
  address: string;
  user?: string;
  tags: string[];
  created_at: Date;
}

/**
 * Get user custom addresses tags
 *
 * @param address - address to get tags
 * @returns - tags of address
 */
const getCustomAddressesTags = async (address: string): Promise<string[]> => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return [];
  }

  const user = authService.getCurrentUser();

  try {
    const q = query(
      collection(db, "customAddressesTags"),
      where("address", "==", address),
      where("user", "==", user?.uid),
      limit(1),
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      return data.tags;
    }
    return [];
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
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    console.error("User tried to store tags but was not logged in");
    return;
  }

  const user = authService.getCurrentUser();

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

/**
 * Delete user custom addresses tag
 *
 * @param address - address to delete tag
 * @param tag - tag to delete
 */
const deleteCustomAddressTag = async (address: string, tag: string) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    console.error("User tried to delete tag but was not logged in");
    return;
  }

  const user = authService.getCurrentUser();

  const q = query(
    collection(db, "customAddressesTags"),
    where("address", "==", address),
    where("user", "==", user?.uid),
  );
  const querySnapshot = await getDocs(q);

  console.log(querySnapshot.empty);

  if (!querySnapshot.empty) {
    const docRef = doc(db, "customAddressesTags", querySnapshot.docs[0].id);
    const data = querySnapshot.docs[0].data();
    const tags = data.tags.filter((t: string) => t !== tag);
    console.log(tags);
    await updateDoc(docRef, {
      tags,
    });
  }
};

export {
  deleteCustomAddressTag,
  getCustomAddressesTags,
  storeCustomAddressesTags,
};
