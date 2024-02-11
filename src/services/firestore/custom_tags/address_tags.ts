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
import { db } from "../../firebase";
import { getVerifiedUser } from "../../auth/auth.services";

/** Gets an address' custom tags for the current user.
 * @param address The address to get the tags for
 * @returns The tags for the address
 */
export async function getCustomAddressesTags(
  address: string,
): Promise<string[]> {
  const user = getVerifiedUser();

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
    console.error(
      "Error getting custom addresses tags for address ",
      address,
      " \n User was ",
      user,
      " \n Error: ",
      error,
    );
    return [];
  }
}

/** Sets an address' custom tags for the current user.
 * @param address The address to set the tags for
 * @param tags The tags to set
 */
export async function setCustomAddressesTags(address: string, tags: string[]) {
  const user = getVerifiedUser();

  let q;
  try {
    q = query(
      collection(db, "customAddressesTags"),
      where("address", "==", address),
      where("user", "==", user?.uid),
    );
  } catch (error) {
    console.error(error);
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
}

/** Deletes a specific tag from an address' custom tags for the current user.
 * @param address The address to delete tag from
 * @param tag The tag to delete
 */
export async function deleteCustomAddressTag(address: string, tag: string) {
  const user = getVerifiedUser();

  const q = query(
    collection(db, "customAddressesTags"),
    where("address", "==", address),
    where("user", "==", user?.uid),
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docRef = doc(db, "customAddressesTags", querySnapshot.docs[0].id);
    const data = querySnapshot.docs[0].data();
    const tags = data.tags.filter((t: string) => t !== tag);
    await updateDoc(docRef, {
      tags,
    });
  }
}
