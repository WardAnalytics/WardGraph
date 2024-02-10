import { FC, useContext } from "react";
import { FormProvider, useForm } from 'react-hook-form';
import authService from "../../services/auth/auth.services";
import { AuthContext } from "./AuthDialog";
import AuthInput from "./AuthInput";
import SignInWithGoogleButton from "./SignInWithGoogleButton";

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { AuthDialogState } from "./AuthDialog";

const SignupForm: FC = () => {
  const {
    onSignupSuccess,
    onSignupError,
    onGoogleSignupSucess,
    onGoogleSignupError,
    setAuthDialogState,
  } = useContext(AuthContext);

  const handleGoogleSignIn = () => {
    authService.signUpWithGoogle(onGoogleSignupSucess, onGoogleSignupError);
  };

  const formSchema = z.object({
    email: z.string({
      required_error: "Email is required",
      invalid_type_error: "Email should be a string"
    }).email("Invalid email address"),
    password: z.string({
      required_error: "Password is required",
      invalid_type_error: "Password should be a string"
    }).min(6, "Password length should be at least 6 characters")
      .max(12, "Password cannot exceed more than 12 characters"),
    confirm_password: z.string({
      required_error: "Confirm Password is required",
      invalid_type_error: "Confirm Password should be a string"
    }).min(6, "Password length should be at least 6 characters")
      .max(12, "Password cannot exceed more than 12 characters")
  }).refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"], // path of error
  });

  type SignUpSchema = z.infer<typeof formSchema>

  const methods = useForm<SignUpSchema>({
    mode: "onBlur",
    resolver: zodResolver(formSchema)
  });
  const { handleSubmit } = methods;

  const createAccount = (data: SignUpSchema) => {

    const email = data.email;
    const password = data.password

    authService.signUp(email, password, onSignupSuccess, onSignupError);
  };

  return (
    <>
      <div className="w-full">
        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={handleSubmit(createAccount)}>
            <div>
              <AuthInput
                label="Email"
                type="email"
                name="email"
                id="email"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <AuthInput
                label="Password"
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
              />
            </div>
            <div>
              <AuthInput
                label="Confirm password"
                type="password"
                name="confirm_password"
                id="confirm-password"
                placeholder="••••••••"
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
        </FormProvider>

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
          onClick={() => setAuthDialogState(AuthDialogState.LOGIN)}
        >
          Sign in
        </button>
      </p>
    </>
  );
};

export default SignupForm;
