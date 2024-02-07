import { FC, Fragment, createContext, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import AuthApiErrors from "../../services/auth/auth.errors";

import ForgotPasswordForm from "./ForgotPasswordForm";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { EnvelopeIcon } from "@heroicons/react/24/solid";

export enum AuthDialogState {
  LOGIN,
  SIGNUP,
  FORGOT_PASSWORD,
}

interface AuthContextProps {
  onLoginSuccess: () => void;
  onLoginError: (error: any) => void;
  onGoogleLoginSucess: () => void;
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
}

const AuthDialog: FC<AuthDialogProps> = ({ isOpen, setIsOpen }) => {
  const [authDialogState, setAuthDialogState] = useState(AuthDialogState.LOGIN);
  const [authApiErrorMessage, setAuthApiErrorMessage] = useState<string | null>(
    null,
  );
  const [verifyEmailMessage, setVerifyEmailMessage] = useState<string | null>(
    null,
  );

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
  const onLoginSuccess = () => {
    closeDialog();
  };

  /**
   * Callback function for when the user fails to log in
   *
   * @param error
   * @returns void
   */
  const onLoginError = (error: any) => {
    switch (error.code) {
      case AuthApiErrors.INVALID_CREDENTIAL.code:
        setAuthApiErrorMessage(AuthApiErrors.INVALID_CREDENTIAL.message);
        break;
      case AuthApiErrors.EMAIL_VERIFICATION_REQUIRED.code:
        setAuthApiErrorMessage(
          AuthApiErrors.EMAIL_VERIFICATION_REQUIRED.message,
        );
        break;
      default:
        setAuthApiErrorMessage(
          "An error occured while logging in. Please try again later.",
        );
        break;
    }
  };

  /**
   * Callback function for when the user successfully logs in with Google
   *
   * @returns void
   */
  const onGoogleLoginSucess = () => {
    closeDialog();
  };

  /**
   * Callback function for when the user fails to log in with Google
   *
   * @param error
   * @returns void
   */
  const onGoogleLoginError = (error: any) => {
    switch (error.code) {
      case AuthApiErrors.EMAIL_ALREADY_EXISTS.code:
        setAuthApiErrorMessage(AuthApiErrors.EMAIL_ALREADY_EXISTS.message);
        break;
      default:
        setAuthApiErrorMessage(
          "An error occured while logging in. Please try again later.",
        );
        break;
    }
  };

  /**
   * Callback function for when the user successfully signs up
   *
   * @returns void
   */
  const onSignupSuccess = () => {
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
    console.error(error);

    switch (error.code) {
      case AuthApiErrors.EMAIL_ALREADY_EXISTS.code:
        setAuthApiErrorMessage(AuthApiErrors.EMAIL_ALREADY_EXISTS.message);
        break;
      case AuthApiErrors.EMAIL_ALREADY_IN_USE.code:
        setAuthApiErrorMessage(AuthApiErrors.EMAIL_ALREADY_IN_USE.message);
        break;
      default:
        setAuthApiErrorMessage(
          "An error occured while signing up. Please try again later.",
        );
        break;
    }
  };

  /**
   * Callback function for when the user successfully signs up with Google
   *
   * @returns void
   */
  const onGoogleSignupSucess = () => {
    setAuthDialogState(AuthDialogState.LOGIN);
  };

  /**
   * Callback function for when the user fails to sign up with Google
   *
   * @param error
   * @returns void
   */
  const onGoogleSignupError = (error: any) => {
    switch (error.code) {
      case AuthApiErrors.EMAIL_ALREADY_EXISTS.code:
        setAuthApiErrorMessage(AuthApiErrors.EMAIL_ALREADY_EXISTS.message);
        break;
      default:
        setAuthApiErrorMessage(
          "An error occured while signing up. Please try again later.",
        );
        break;
    }
  };

  /**
   * Callback function for when the user successfully resets their password
   *
   * @returns void
   */
  const onResetPasswordSuccess = () => {
    setAuthDialogState(AuthDialogState.LOGIN);
  };

  /**
   * Callback function for when the user fails to reset their password
   *
   * @param error
   */
  const onResetPasswordError = (error: any) => {
    switch (error.code) {
      case AuthApiErrors.INVALID_CREDENTIAL.code:
        setAuthApiErrorMessage(AuthApiErrors.INVALID_CREDENTIAL.message);
        break;
      default:
        setAuthApiErrorMessage(
          "An error occured while logging in. Please try again later.",
        );
        break;
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
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeDialog}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex w-full max-w-md transform flex-col overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <h3 className="flex flex-row items-center gap-x-1.5 text-lg font-semibold leading-6 text-gray-900">
                      {authDialogState === AuthDialogState.LOGIN ? (
                        <>Sign in to your account</>
                      ) : authDialogState ===
                        AuthDialogState.FORGOT_PASSWORD ? (
                        <>Reset your password</>
                      ) : (
                        <>Create an account</>
                      )}
                    </h3>

                    <XMarkIcon
                      className="h-7 w-7 cursor-pointer p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AuthDialog;
