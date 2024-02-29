import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { USERS_COLLECTION } from "./constants";

// Information about the user that is stored in the database
// The authentication information is handled by the firebase auth service
// This is just additional information that is stored in the database
export interface UserDB {
  email: string;
  is_premium: boolean;
  name: string | null;
  company_name: string;
  role: string;
  phone_number?: string;
  country?: string;
}

/** Creates a user in the database
 * @param user - The user to be created in the database
 */
export const createUserInDatabase = async (userID: string, newUser: UserDB) => {
  // Checks if user exists in the database
  const userRef = doc(db, USERS_COLLECTION, userID);
  const docRef = await getDoc(userRef);

  // If the user exists, return
  if (docRef.exists()) return;

  await setDoc(doc(db, USERS_COLLECTION, userID), newUser);

  return newUser;
};

/** Updates a user in the database
 *
 * @param userID - The user to be retrieved from the database
 * @param updatedUser - The updated user information
 */
export const updateUserInDatabase = async (
  userID: string,
  updatedUser: Partial<UserDB>,
) => {
  const userRef = doc(db, USERS_COLLECTION, userID);
  await setDoc(userRef, updatedUser, { merge: true });
};
