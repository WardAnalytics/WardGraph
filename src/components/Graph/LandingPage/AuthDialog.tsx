import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  KeyIcon,
  LockClosedIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { FC, Fragment, createContext, useState } from "react";
import ForgotPasswordForm from "../../auth/ForgotPasswordForm";
import LoginForm from "../../auth/LoginForm";
import SignupForm from "../../auth/SignupForm";
import BigButton from "../../common/BigButton";
import AuthApiErrors from "../../../services/auth/auth.errors";

enum AuthDialogState {
  LOGIN,
  SIGNUP,
  FORGOT_PASSWORD,
}

interface AuthContextProps {
  onAuthentication: () => void;
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
  moveToLoginState: () => void;
  moveToSignUpState: () => void;
  moveToForgotPasswordState: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  onAuthentication: () => {},
  onLoginSuccess: () => {},
  onLoginError: () => {},
  onGoogleLoginSucess: () => {},
  onGoogleLoginError: () => {},
  onSignupSuccess: () => {},
  onSignupError: () => {},
  onGoogleSignupSucess: () => {},
  onGoogleSignupError: () => {},
  onResetPasswordSuccess: () => {},
  onResetPasswordError: () => {},
  moveToLoginState: () => {},
  moveToSignUpState: () => {},
  moveToForgotPasswordState: () => {},
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

  const [isAuthenticating, setIsAuthenticating] = useState(false);

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
  };

  const onAuthentication = () => {
    setIsAuthenticating(true);
  };

  /**
   * Callback function for when the user successfully logs in
   *
   * @returns void
   */
  const onLoginSuccess = () => {
    setIsAuthenticating(false);
    closeDialog();
  };

  /**
   * Callback function for when the user fails to log in
   *
   * @param error
   * @returns void
   */
  const onLoginError = (error: any) => {
    setIsAuthenticating(false);

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
    setIsAuthenticating(false);
    closeDialog();
  };

  /**
   * Callback function for when the user fails to log in with Google
   *
   * @param error
   * @returns void
   */
  const onGoogleLoginError = (error: any) => {
    setIsAuthenticating(false);

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
    setIsAuthenticating(false);
    moveToLoginState();
  };

  /**
   * Callback function for when the user fails to sign up
   *
   * @param error
   * @returns void
   */
  const onSignupError = (error: any) => {
    setIsAuthenticating(false);

    console.log(error);

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
    setIsAuthenticating(false);
    moveToLoginState();
  };

  /**
   * Callback function for when the user fails to sign up with Google
   *
   * @param error
   * @returns void
   */
  const onGoogleSignupError = (error: any) => {
    setIsAuthenticating(false);

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
    setIsAuthenticating(false);
    moveToLoginState();
  };

  /**
   * Callback function for when the user fails to reset their password
   *
   * @param error
   */
  const onResetPasswordError = (error: any) => {
    setIsAuthenticating(false);

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

  /**
   * Changes the dialog state to SIGNUP
   *
   * @returns void
   */
  const moveToSignUpState = () => {
    resetAuthApiErrorMessage();
    setAuthDialogState(AuthDialogState.SIGNUP);
  };

  /**
   * Changes the dialog state to LOGIN
   *
   * @returns void
   */
  const moveToLoginState = () => {
    resetAuthApiErrorMessage();
    setAuthDialogState(AuthDialogState.LOGIN);
  };

  /**
   * Changes the dialog state to FORGOT_PASSWORD
   *
   * @returns void
   */
  const moveToForgotPasswordState = () => {
    resetAuthApiErrorMessage();
    setAuthDialogState(AuthDialogState.FORGOT_PASSWORD);
  };

  const authContext: AuthContextProps = {
    onAuthentication,
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
    moveToLoginState,
    moveToSignUpState,
    moveToForgotPasswordState,
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
                      <div className="mt-3 flex flex-col items-center justify-center gap-y-2 rounded-lg bg-red-100 p-4 shadow-lg">
                        <p className="text-red-500">{authApiErrorMessage}</p>
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
                  <div>
                    {isAuthenticating && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm backdrop-filter">
                        <div className="flex flex-col items-center justify-center gap-y-2 rounded-lg bg-white p-4 shadow-lg">
                          <svg
                            className="h-5 w-5 animate-spin text-blue-500 dark:text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            ></path>
                          </svg>
                          <p className="text-blue-500 dark:text-white">
                            Please wait...
                          </p>
                        </div>
                      </div>
                    )}
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
