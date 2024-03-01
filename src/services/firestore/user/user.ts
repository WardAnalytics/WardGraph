import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { User } from "firebase/auth";
import { USERS_COLLECTION } from "./constants";

// Information about the user that is stored in the database
// The authentication information is handled by the firebase auth service
// This is just additional information that is stored in the database
interface UserDB {
  email: string;
  name: string | null;
}

/** Creates a user in the database
 * @param user - The user to be created in the database
 */
export const createUserInDatabase = async (user: User) => {
  // Checks if user exists in the database
  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const docRef = await getDoc(userRef);

  // If the user exists, return
  if (docRef.exists()) return;

  // Saves the user in the firestore database
  const newUser: UserDB = {
    email: user.email!,
    name: user.displayName,
  };

  await setDoc(doc(db, USERS_COLLECTION, user.uid), newUser);
};
