import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getVerifiedUser } from "../../auth/auth.services";
import { db } from "../../firebase";

interface CustomUserTags {
  user: string;
  tags: string[];
}

/** Returns all of a user's custom tags.
 * @returns The user's custom tags
 */
export async function getCustomUserTags(): Promise<string[]> {
  const user = getVerifiedUser();

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
    console.error(error);
    return [];
  }
}

/** Adds a custom tag to a user's custom tags. Always add it to the start of the array.
 * If it already exists, move it to the start instead.
 * @param tag The tag to add
 */
export async function addCustomUserTag(tag: string) {
  const user = getVerifiedUser();

  let q: any;
  try {
    q = query(collection(db, "customUserTags"), where("user", "==", user.uid));
  } catch (error) {
    console.error(error);
  }
  const querySnapshot = await getDocs(q);

  // If the user has no custom tags, create a new document. Otherwise, update the existing one.
  if (querySnapshot.empty) {
    await addDoc(collection(db, "customUserTags"), {
      user: user.uid,
      tags: [tag],
    });
  } else {
    querySnapshot.forEach(async (doc) => {
      const data = doc.data() as CustomUserTags;
      const tags = data.tags.filter((t: string) => t !== tag);
      await updateDoc(doc.ref, {
        tags: [tag, ...tags], // Add the new tag to the start of the array
      });
    });
  }
}

/** Removes a user's custom tag.
 * @param tag The tag to remove
 */
export async function deleteCustomUserTag(tag: string) {
  const user = getVerifiedUser();

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
}
