import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import authService from "../../auth/auth.services";
import { db } from "../../firebase";

export interface CustomUserTag {
  user: string;
  tags: string[];
  created_at: Date;
}

/**
 * Get user custom tags
 *
 * @returns - tags of user
 *
 */
const getCustomUserTags = async (): Promise<string[]> => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return [];
  }

  const user = authService.getCurrentUser();

  try {
    const q = query(
      collection(db, "customUserTags"),
      where("user", "==", user?.uid),
      limit(1),
    );
    const querySnapshot = await getDocs(q);
    let data: string[] = [];
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        data = doc.data().tags;
      });
    }
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Store user custom tags if not exists
 * If exists, update tags
 *
 * @param tags - tags to store
 *
 */
const storeCustomUserTags = async (tags: string[]) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    console.error("User tried to store tags but was not logged in");
    return;
  }

  const user = authService.getCurrentUser();

  let q: any;
  try {
    q = query(collection(db, "customUserTags"), where("user", "==", user?.uid));
  } catch (error) {
    console.log(error);
  }
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    await addDoc(collection(db, "customUserTags"), {
      user: user?.uid,
      tags: tags,
      created_at: new Date(),
    });
  } else {
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, {
        tags: tags,
      });
    });
  }
};

/**
 * Remove user custom tag
 *
 * @param tag - tag to remove
 */
const removeCustomUserTag = async (tag: string) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    console.error("User tried to remove tag but was not logged in");
    return;
  }

  const user = authService.getCurrentUser();

  const q = query(
    collection(db, "customUserTags"),
    where("user", "==", user?.uid),
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    querySnapshot.forEach(async (doc) => {
      const tags = doc.data().tags.filter((t: string) => t !== tag);
      await updateDoc(doc.ref, {
        tags: tags,
      });
    });
  }
};

export { getCustomUserTags, removeCustomUserTag, storeCustomUserTags };
