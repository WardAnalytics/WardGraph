import { FC, useContext } from "react";
import AuthInput from "../common/auth/AuthInput";
import { AuthContext } from "./AuthDialog";
import authService from "../../services/auth/auth.services";

const ForgotPasswordForm: FC = () => {
  const {
    onAuthentication,
    onResetPasswordSuccess,
    onResetPasswordError,
    moveToLoginState,
  } = useContext(AuthContext);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onAuthentication();

    const email = e.currentTarget.email.value;

    authService.resetUserPassword(
      email,
      onResetPasswordSuccess,
      onResetPasswordError,
    );
  };

  return (
    <>
      <div className="w-full">
        <form className=" space-y-4" onSubmit={handleSubmit}>
          <div>
            <AuthInput
              label="Email"
              type="email"
              name="email"
              id="email"
              placeholder="name@company.com"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
          >
            Reset password
          </button>
        </form>
      </div>
      <p className="mt-10 text-center text-sm text-gray-500 dark:text-white">
        Remembered your password?{" "}
        <button
          className="font-semibold leading-6 text-blue-500 hover:text-blue-400 dark:text-white dark:hover:text-slate-100"
          onClick={moveToLoginState}
        >
          Login
        </button>
      </p>
    </>
  );
};

export default ForgotPasswordForm;