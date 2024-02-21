import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FC, createContext, useEffect, useState } from "react";

import AuthApiErrors from "../../services/auth/auth.errors";

import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router";
import { logAnalyticsEvent } from "../../services/firestore/analytics/analytics";
import Modal from "../common/Modal";
import ForgotPasswordForm from "./ForgotPasswordForm";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { RedirectUrl } from "./WithAuth";


export enum AuthDialogState {
  LOGIN,
  SIGNUP,
  FORGOT_PASSWORD,
}

interface AuthContextProps {
  onLoginSuccess: (userID: string) => void;
  onLoginError: (error: any) => void;
  onGoogleLoginSucess: (userID: string) => void;
  onGoogleLoginError: (error: any) => void;
  onSignupSuccess: () => void;
  onSignupError: (error: any) => void;
  onGoogleSignupSucess: () => void;
  onGoogleSignupError: (error: any) => void;
  onResetPasswordSuccess: () => void;
  onResetPasswordError: (error: any) => void;
  setAuthDialogState: (state: AuthDialogState) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  onLoginSuccess: () => { },
  onLoginError: () => { },
  onGoogleLoginSucess: () => { },
  onGoogleLoginError: () => { },
  onSignupSuccess: () => { },
  onSignupError: () => { },
  onGoogleSignupSucess: () => { },
  onGoogleSignupError: () => { },
  onResetPasswordSuccess: () => { },
  onResetPasswordError: () => { },
  setAuthDialogState: () => { },
});

interface AuthDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  redirectUrl?: RedirectUrl;
  signInText?: string;
}

const AuthDialog: FC<AuthDialogProps> = ({
  isOpen,
  setIsOpen,
  redirectUrl = { pathname: "graph" },
  signInText = "Sign in to your account"
}) => {
  const navigate = useNavigate();

  const [authDialogState, setAuthDialogState] = useState(AuthDialogState.LOGIN);
  const [authApiErrorMessage, setAuthApiErrorMessage] = useState<string | null>(
    null,
  );
  const [verifyEmailMessage, setVerifyEmailMessage] = useState<string | null>(
    null,
  );

  const redirectOnLogin = (userID: string) => {

    const { pathname, queryParams } = redirectUrl;

    const url: { pathname: string; search: string } = {
      pathname,
      search: ""
    }

    url.pathname = `/${userID}/${pathname}`;

    if (queryParams) {
      const searchParams = new URLSearchParams(queryParams);
      url.search = searchParams.toString();

    }

    console.log(url);

    navigate(url);

  }

  /**
   * Resets the authApiErrorMessage state to null
   *
   * @returns void
   */
  const resetAuthApiErrorMessage = () => {
    setAuthApiErrorMessage(null);
  };

  /**
   * Closes the dialog and resets the state to LOGIN
   *
   * @returns void
   */
  const closeDialog = () => {
    setIsOpen(false);
    setAuthDialogState(AuthDialogState.LOGIN);
    setAuthApiErrorMessage(null);
    setVerifyEmailMessage(null);
  };

  /**
   * Callback function for when the user successfully logs in
   *
   * @returns void
   */
  const onLoginSuccess = (userID: string) => {
    logAnalyticsEvent("login", { method: "email" });
    closeDialog();
    redirectOnLogin(userID);
  };

  /**
   * Callback function for when the user fails to log in
   *
   * @param error
   * @returns void
   */
  const onLoginError = (error: any) => {
    logAnalyticsEvent("login_error", { method: "email", error });
    const errorCode = error.code;
    if (errorCode in AuthApiErrors) {
      setAuthApiErrorMessage(AuthApiErrors[errorCode].message);
    } else {
      setAuthApiErrorMessage(
        "An error occured while logging in. Please try again later.",
      );
    }
  };

  /**
   * Callback function for when the user successfully logs in with Google
   *
   * @returns void
   */
  const onGoogleLoginSucess = (userID: string) => {
    logAnalyticsEvent("login", { method: "google" });
    closeDialog();
    redirectOnLogin(userID);
  };

  /**
   * Callback function for when the user fails to log in with Google
   *
   * @param error
   * @returns void
   */
  const onGoogleLoginError = (error: any) => {
    logAnalyticsEvent("login_error", { method: "google", error });
    const errorCode = error.code;
    if (errorCode in AuthApiErrors) {
      setAuthApiErrorMessage(AuthApiErrors[errorCode].message);
    } else {
      setAuthApiErrorMessage(
        "An error occured while logging in. Please try again later.",
      );
    }
  };

  /**
   * Callback function for when the user successfully signs up
   *
   * @returns void
   */
  const onSignupSuccess = () => {
    logAnalyticsEvent("signup", { method: "email" });
    setAuthDialogState(AuthDialogState.LOGIN);
    setVerifyEmailMessage(
      "A verification email has been sent to your email address. Please verify your email address to continue.",
    );
  };

  /**
   * Callback function for when the user fails to sign up
   *
   * @param error
   * @returns void
   */
  const onSignupError = (error: any) => {
    logAnalyticsEvent("signup_error", { method: "email", error });
    const errorCode = error.code;
    if (errorCode in AuthApiErrors) {
      setAuthApiErrorMessage(AuthApiErrors[errorCode].message);
    } else {
      setAuthApiErrorMessage(
        "An error occured while logging in. Please try again later.",
      );
    }
  };

  /**
   * Callback function for when the user successfully signs up with Google
   *
   * @returns void
   */
  const onGoogleSignupSucess = () => {
    logAnalyticsEvent("signup", { method: "google" });
    setAuthDialogState(AuthDialogState.LOGIN);
  };

  /**
   * Callback function for when the user fails to sign up with Google
   *
   * @param error
   * @returns void
   */
  const onGoogleSignupError = (error: any) => {
    logAnalyticsEvent("signup_error", { method: "google", error });
    const errorCode = error.code;
    if (errorCode in AuthApiErrors) {
      setAuthApiErrorMessage(AuthApiErrors[errorCode].message);
    } else {
      setAuthApiErrorMessage(
        "An error occured while logging in. Please try again later.",
      );
    }
  };

  /**
   * Callback function for when the user successfully resets their password
   *
   * @returns void
   */
  const onResetPasswordSuccess = () => {
    logAnalyticsEvent("reset_password");
    setAuthDialogState(AuthDialogState.LOGIN);
  };

  /**
   * Callback function for when the user fails to reset their password
   *
   * @param error
   */
  const onResetPasswordError = (error: any) => {
    logAnalyticsEvent("reset_password_error", { error });
    const errorCode = error.code;
    if (errorCode in AuthApiErrors) {
      setAuthApiErrorMessage(AuthApiErrors[errorCode].message);
    } else {
      setAuthApiErrorMessage(
        "An error occured while logging in. Please try again later.",
      );
    }
  };

  useEffect(() => {
    resetAuthApiErrorMessage();
  }, [authDialogState]);

  const authContext: AuthContextProps = {
    onLoginSuccess,
    onLoginError,
    onGoogleLoginSucess,
    onGoogleLoginError,
    onSignupSuccess,
    onSignupError,
    onGoogleSignupSucess,
    onGoogleSignupError,
    onResetPasswordSuccess,
    onResetPasswordError,
    setAuthDialogState,
  };

  return (
    <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)} size="md">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h3 className="flex flex-row items-center gap-x-1.5 text-lg font-semibold leading-6 text-gray-900">
          {authDialogState === AuthDialogState.LOGIN ? (
            <>{signInText}</>
          ) : authDialogState ===
            AuthDialogState.FORGOT_PASSWORD ? (
            <>Reset your password</>
          ) : (
            <>Create an account</>
          )}
        </h3>

        <XMarkIcon
          className="h-11 w-11 cursor-pointer rounded-full p-1.5 text-gray-400 transition-all duration-300 hover:bg-gray-100"
          aria-hidden="true"
          onClick={closeDialog}
        />
      </div>
      <div className="mt-3">
        {authApiErrorMessage && (
          <div className="justify-left mb-3 flex flex-row items-center gap-x-3 rounded-lg bg-red-50 p-4">
            <ExclamationTriangleIcon className="h-7 w-7 text-red-500" />
            <p className="text-red-800">{authApiErrorMessage}</p>
          </div>
        )}
        {verifyEmailMessage && (
          <div className="justify-left mb-3 flex flex-row items-center gap-x-3 rounded-lg bg-blue-50 p-4">
            <EnvelopeIcon className="h-7 w-7 text-blue-500" />
            <p className="text-blue-800">{verifyEmailMessage}</p>
          </div>
        )}
        <AuthContext.Provider value={authContext}>
          {authDialogState === AuthDialogState.LOGIN ? (
            <LoginForm />
          ) : authDialogState ===
            AuthDialogState.FORGOT_PASSWORD ? (
            <ForgotPasswordForm />
          ) : (
            <SignupForm />
          )}
        </AuthContext.Provider>
      </div>
    </Modal >
  );
};

export default AuthDialog;
