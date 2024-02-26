// User Error is a base class for all user related errors. We can cacth them in bulk and handle them accordingly.
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }
}

export class UserNotLoggedInError extends AuthError {
  constructor(message: string = "User is not logged in") {
    super(message);
    this.name = "UserNotLoggedInError";
  }
}

export class UserEmailNotVerifiedError extends AuthError {
  constructor(message: string = "The user's email is not verified") {
    super(message);
    this.name = "UserEmailNotVerifiedError";
  }
}

export class UserNotPremiumError extends AuthError {
  constructor(message: string = "User is not premium") {
    super(message);
    this.name = "UserNotPremiumError";
  }
}
