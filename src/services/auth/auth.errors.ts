/*

  This file contains all the error codes that can be returned by the auth api.
  These error codes are used to determine what message to show to the user.

  For more information on the error codes, see:
  https://firebase.google.com/docs/auth/admin/errors

*/

const AuthApiErrors: any = {
  // Sign up errors
  "auth/email-already-exists": {
    code: "EMAIL_ALREADY_EXISTS",
    message:
      "An account with this email already exists. Please sign in with your email and password.",
  },
  "auth/email-already-in-use": {
    code: "EMAIL_ALREADY_IN_USE",
    message:
      "An account with this email was created with a different sign in method. Please sign in with the same method (ex. Sign up with Google).",
  },
  "auth/invalid-email": { code: "INVALID_EMAIL", message: "Invalid email" },
  "auth/weak-password": {
    code: "WEAK_PASSWORD",
    message: "Password is too weak.",
  },

  // Login errors
  "auth/user-not-found": {
    code: "EMAIL_NOT_FOUND",
    message: "No user found with those credentials. Please register first.",
  },
  "auth/invalid-credential": {
    code: "INVALID_CREDENTIAL",
    message: "Wrong credentials.",
  },

  // Email verification errors
  "auth/email-not-verified": {
    code: "EMAIL_VERIFICATION_REQUIRED",
    message: "Please verify your email first.",
  },

  // Other errors
  "auth/unknown-error": { code: "UNKNOWN_ERROR", message: "Unknown error" },
};

export default AuthApiErrors;
