import { FC, useContext } from "react";
import authService from "../../services/auth/auth.services";
import { AuthContext } from "../Graph/LandingPage/AuthDialog";
import AuthInput from "../common/auth/AuthInput";
import SignInWithGoogleButton from "../common/auth/SignInWithGoogleButton";

const LoginForm: FC = () => {
  const {
    onAuthentication,
    onLoginSuccess,
    onLoginError,
    onGoogleLoginSucess,
    onGoogleLoginError,
    moveToSignUpState,
    moveToForgotPasswordState,
  } = useContext(AuthContext);

  const handleGoogleSignIn = () => {
    authService.signUpWithGoogle(onGoogleLoginSucess, onGoogleLoginError);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onAuthentication();

    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    authService.login(email, password, onLoginSuccess, onLoginError);
  };

  return (
    <>
      <div className="w-full">
        <form className="space-y-6" onSubmit={handleSubmit} method="POST">
          <div>
            <AuthInput
              label="Email"
              type="email"
              name="email"
              id="email"
              placeholder="name@company.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <AuthInput
              label="Password"
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <div className="mt-2 flex justify-end text-sm">
              <button
                type="button"
                className="bg-white font-semibold text-blue-500 hover:text-blue-400 dark:text-white dark:hover:text-slate-100"
                onClick={moveToForgotPasswordState}
              >
                Forgot password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Sign in
            </button>
          </div>
        </form>

        <SignInWithGoogleButton
          text={"Sign in with Google"}
          handleGoogleSignIn={handleGoogleSignIn}
        />
      </div>
      <p className="mt-10 text-center text-sm text-gray-500 dark:text-white">
        Don't have an account?{" "}
        <button
          type="button"
          className="dark:text-white-600 bg-white font-semibold leading-6 text-blue-500 hover:text-blue-400 dark:hover:text-slate-100"
          onClick={moveToSignUpState}
        >
          Sign up
        </button>
      </p>
    </>
  );
};

export default LoginForm;
