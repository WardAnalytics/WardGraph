import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "@firebase/auth";
import { UserEmailNotVerifiedError, UserNotLoggedInError } from "./errors";
import { User as FirebaseUser } from "firebase/auth";

import { sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { createUserInDatabase } from "../firestore/user";
import AuthApiErrorCodes from "./auth.errors";
import { UserDB } from "../firestore/user/user";

export interface User extends FirebaseUser {
  userData?: UserDB;
}

export interface NewUser {
  email: string;
  password: string;
  userData?: UserDB;
}

/**
 * Signup a new user with email and password using Firebase Authentication
 *
 * @param email - user email
 * @param password - user password
 * @param onSuccess - callback function to be executed on successful signup
 * @param onError - callback function to be executed on signup error
 */
const signUp = async (
  newUser: NewUser,
  onSuccess: () => void,
  onError: (error: any) => void,
) => {
  const { email, password } = newUser;

  await createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Send verification email
      await sendEmailVerification(userCredential.user)
        .then(() => {
          const { uid: userID } = userCredential.user;
          const newUserDB: UserDB = {
            email: email,
            is_premium: false,
          };

          // Saves user in the firestore database
          createUserInDatabase(userID, newUserDB)
            .then((newUserDB) => {
              const newUser = {
                ...userCredential.user,
                userData: newUserDB,
              };

              localStorage.setItem("user", JSON.stringify(newUser));
              onSuccess();
            })
            .catch((error) => {
              onError(error);
            });
        })
        .catch((error) => {
          onError(error);
        });
    })
    .catch((error) => {
      onError(error);
    });
};

/**
 * Login a user with email and password using Firebase Authentication
 *
 * @param email - user email
 * @param password - user password
 * @param onSuccess - callback function to be executed on successful login
 * @param onError - callback function to be executed on login error
 */
const login = async (
  email: string,
  password: string,
  onSuccess: (userID: string) => void,
  onError: (error: any) => void,
) => {
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const { uid: userID, emailVerified } = userCredential.user;

      // Check if user email is verified
      if (userID && !emailVerified) {
        onError(AuthApiErrorCodes.EMAIL_VERIFICATION_REQUIRED);
        return;
      }

      onSuccess(userID);
    })
    .catch((error) => {
      onError(error);
    });
};

/**
 * Logout the current user
 *
 * @param onSuccess - callback function to be executed on successful logout
 * @param onError - callback function to be executed on logout error
 */

const logout = async (onSuccess: () => void, onError: (error: any) => void) => {
  await signOut(auth)
    .then(() => {
      onSuccess();
    })
    .catch((error) => {
      onError(error);
    });
};

/**
 * Signup a new user with Google using Firebase Authentication
 *
 * @param onSuccess - callback function to be executed on successful signup
 * @param onError - callback function to be executed on signup error
 */
const signUpWithGoogle = async (
  onSuccess: (userID: string) => void,
  onError: (error: any) => void,
) => {
  await signInWithPopup(auth, googleProvider)
    .then((userCredential) => {
      const { uid: userID } = userCredential.user;

      const newUser: User = {
        ...userCredential.user,
        userData: {
          email: userCredential.user.email!,
          is_premium: false,
        },
      };

      // Saves user in the firestore database
      createUserInDatabase(userID, newUser.userData!).then((newUser) => {
        localStorage.setItem("user", JSON.stringify(newUser));
        onSuccess(userID);
      });
    })
    .catch((error) => {
      onError(error);
    });
};

/**
 * Get the current user
 *
 * @returns current user
 */
const getCurrentUser = () => {
  const user = auth.currentUser;
  return user;
};

/**
 * Send a password reset email
 *
 * @param email - user email
 * @param onSuccess - callback function to be executed on successful signup
 * @param onError - callback function to be executed on signup error
 */
const resetUserPassword = async (
  email: string,
  onSuccess: () => void,
  onError: (error: any) => void,
) => {
  await sendPasswordResetEmail(auth, email)
    .then(() => {
      // Password reset email sent!
      onSuccess();
    })
    .catch((error) => {
      onError(error);
    });
};

/**
 * Check if the user is authenticated
 *
 * @returns true if the user is authenticated, false otherwise
 */
const isAuthenticated = () => {
  const user = getCurrentUser();
  return user?.emailVerified;
};

/**
 * Checks if the current user is logged in and their email is verified.
 * Throws specific errors for each condition if not met.
 * @returns The verified user.
 * @throws {UserNotLoggedInError} If the user is not logged in.
 * @throws {UserEmailNotVerifiedError} If the user's email is not verified.
 */
export function getVerifiedUser(): FirebaseUser {
  const user = authService.getCurrentUser();
  if (user === null) {
    throw new UserNotLoggedInError();
  }
  if (!user.emailVerified) {
    throw new UserEmailNotVerifiedError();
  }
  return user;
}

const authService = {
  signUp,
  login,
  logout,
  signUpWithGoogle,
  getCurrentUser,
  resetUserPassword,
  isAuthenticated,
};

export default authService;
