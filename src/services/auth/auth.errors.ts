/*

  This file contains all the error codes that can be returned by the auth api.
  These error codes are used to determine what message to show to the user.

  For more information on the error codes, see:
  https://firebase.google.com/docs/auth/admin/errors

*/

const AuthApiErrors = {
  // Sign up errors
  EMAIL_ALREADY_EXISTS: {
    code: "auth/email-already-exists",
    message:
      "An account with this email already exists. Please sign in with your email and password.",
  },
  EMAIL_ALREADY_IN_USE: {
    code: "auth/email-already-in-use",
    message:
      "An account with this email was created with a different sign in method. Please sign in with the same method (ex. Sign up with Google).",
  },
  INVALID_EMAIL: { code: "auth/invalid-email", message: "Invalid email" },
  WEAK_PASSWORD: {
    code: "auth/weak-password",
    message: "Password is too weak",
  },

  // Login errors
  INVALID_CREDENTIAL: {
    code: "auth/invalid-credential",
    message: "Wrong email or password",
  },
  USER_NOT_FOUND: {
    code: "auth/user-not-found",
    message:
      "No user found with that email or password. Please register first.",
  },

  // Email verification errors
  EMAIL_VERIFICATION_REQUIRED: {
    code: "auth/email-not-verified",
    message: "Please verify your email first",
  },

  // Other errors
  UNKNOWN_ERROR: { code: "auth/unknown-error", message: "Unknown error" },
};

export default AuthApiErrors;
