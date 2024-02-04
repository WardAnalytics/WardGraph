import { FC, useContext } from "react";
import authService from "../../services/auth/auth.services";
import { AuthContext } from "../Graph/LandingPage/AuthDialog";
import AuthInput from "../common/auth/AuthInput";
import SignInWithGoogleButton from "../common/auth/SignInWithGoogleButton";

const SignupForm: FC = () => {
  const {
    onAuthentication,
    onSignupSuccess,
    onSignupError,
    onGoogleSignupSucess,
    onGoogleSignupError,
    moveToLoginState,
  } = useContext(AuthContext);

  const handleGoogleSignIn = () => {
    authService.signUpWithGoogle(onGoogleSignupSucess, onGoogleSignupError);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onAuthentication();

    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    authService.signUp(email, password, onSignupSuccess, onSignupError);
  };

  return (
    <>
      <div className="w-full">
        <form className="space-y-4" onSubmit={handleSubmit}>
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
          <div>
            <AuthInput
              label="Password"
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <AuthInput
              label="Confirm password"
              type="password"
              name="confirm-password"
              id="confirm-password"
              placeholder="••••••••"
              required
            />
          </div>
          {/* <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input id="newsletter" aria-describedby="newsletter" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="newsletter" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                    </div>
                </div> */}
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Create account
          </button>
        </form>

        <SignInWithGoogleButton
          text="Sign up with Google"
          handleGoogleSignIn={handleGoogleSignIn}
        />
      </div>
      <p className="mt-10 text-center text-sm text-gray-500 dark:text-white">
        Already have an account?{" "}
        <button
          type="button"
          className="dark:text-white-600 bg-white font-semibold leading-6 text-blue-500 hover:text-blue-400 dark:hover:text-slate-100"
          onClick={moveToLoginState}
        >
          Sign in
        </button>
      </p>
    </>
  );
};

export default SignupForm;
