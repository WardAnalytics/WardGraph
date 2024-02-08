import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "@firebase/auth";

import { sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import AuthApiErrorCodes from "./auth.errors";

/**
 * Signup a new user with email and password using Firebase Authentication
 *
 * @param email - user email
 * @param password - user password
 * @param onSuccess - callback function to be executed on successful signup
 * @param onError - callback function to be executed on signup error
 */
const signUp = async (
  email: string,
  password: string,
  onSuccess: () => void,
  onError: (error: any) => void,
) => {
  await createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Send verification email
      await sendEmailVerification(userCredential.user)
        .then(() => {
          localStorage.setItem("user", JSON.stringify(userCredential.user));
          onSuccess();
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
  onSuccess: () => void,
  onError: (error: any) => void,
) => {
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Check if user email is verified
      if (user && !user.emailVerified) {
        onError(AuthApiErrorCodes.EMAIL_VERIFICATION_REQUIRED);
        return;
      }

      localStorage.setItem("user", JSON.stringify(userCredential.user));
      onSuccess();
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
      localStorage.removeItem("user");
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
  onSuccess: () => void,
  onError: (error: any) => void,
) => {
  await signInWithPopup(auth, googleProvider)
    .then((userCredential) => {
      localStorage.setItem("user", JSON.stringify(userCredential.user));
      onSuccess();
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

const isAuthenticated = async () => {
  const user = await auth.currentUser;
  return user?.emailVerified;
};

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
