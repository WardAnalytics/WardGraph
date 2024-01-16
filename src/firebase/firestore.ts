import { addDoc, collection, doc, getDoc } from "firebase/firestore";
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

/**
 * Store the url in the database and return the key
 *
 * @param url
 * @returns
 */
const storeUrl = async (url: string) => {
  let key = null;
  try {
    const shortUrlDoc = await addDoc(collection(db, "shortenedUrls"), {
      originalUrl: url,
    });
    key = shortUrlDoc.id;
  } catch (e) {
    console.error(e);
  }

  return key;
};

export default {
  getOriginalUrl,
  storeUrl,
};
