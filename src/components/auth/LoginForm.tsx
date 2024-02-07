import { FC, useContext } from "react";
import authService from "../../services/auth/auth.services";
import { AuthContext } from "./AuthDialog";
import AuthInput from "./AuthInput";
import SignInWithGoogleButton from "./SignInWithGoogleButton";

import { AuthDialogState } from "./AuthDialog";
import * as z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginForm: FC = () => {
  const {
    onLoginSuccess,
    onLoginError,
    onGoogleLoginSucess,
    onGoogleLoginError,
    setAuthDialogState,
  } = useContext(AuthContext);

  const handleGoogleSignIn = () => {
    authService.signUpWithGoogle(onGoogleLoginSucess, onGoogleLoginError);
  };

  type LoginSchema = z.infer<typeof formSchema>

  const formSchema = z.object({
    email: z.string({
      required_error: "Email is required",
      invalid_type_error: "Email should be a string"
    }).email("Invalid email address"),
    password: z.string({
      required_error: "Password is required",
      invalid_type_error: "Password should be a string"
    })
  });

  const methods = useForm<LoginSchema>({
    mode: "onBlur",
    resolver: zodResolver(formSchema)
  });

  const { handleSubmit } = methods;

  const handleLogin = (data: LoginSchema) => {

    const email = data.email;
    const password = data.password

    authService.login(email, password, onLoginSuccess, onLoginError);
  };

  return (
    <>
      <div className="w-full">
        <FormProvider {...methods}>
          <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
            <div>
              <AuthInput
                label="Email"
                type="email"
                name="email"
                id="email"
                placeholder="name@company.com"
                autoComplete="email"
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
              />
              <div className="mt-2 flex justify-end text-sm">
                <button
                  type="button"
                  className="bg-white font-semibold text-blue-500 hover:text-blue-400 dark:text-white dark:hover:text-slate-100"
                  onClick={() =>
                    setAuthDialogState(AuthDialogState.FORGOT_PASSWORD)
                  }
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
        </FormProvider>

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
          onClick={() => setAuthDialogState(AuthDialogState.SIGNUP)}
        >
          Sign up
        </button>
      </p>
    </>
  );
};

export default LoginForm;
