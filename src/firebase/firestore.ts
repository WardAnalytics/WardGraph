import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import firebase from "./firebase";

const db = firebase.db;

/**
 * Get the original url from the database
 *
 * @param key
 * @returns
 */
const getOriginalUrl = async (key: string) => {
  const docRef = doc(db, "shortenedUrls", key);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().originalUrl;
  } else {
    return null;
  }
};

export interface StoreUrlObject {
  originalUrl: string;
  key: string;
}

/**
 * Store the url in the database and return the key
 *
 * @param url
 * @returns
 */
const storeUrl = async (obj: StoreUrlObject) => {
  const key = obj.key;

  try {
    await setDoc(doc(collection(db, "shortenedUrls"), key), {
      originalUrl: obj.originalUrl,
      created_at: new Date(),
    });

    return key;
  } catch (e) {
    console.error(e);
  }
};

export default {
  getOriginalUrl,
  storeUrl,
};
