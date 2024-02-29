import { FC, useContext, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import authService, { NewUser } from "../../services/auth/auth.services";
import { AuthContext } from "./AuthDialog";
import AuthInput from "./AuthInput";
import SignInWithGoogleButton from "./SignInWithGoogleButton";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { rolesList } from "../../utils/roles/roles";
import { AuthDialogState } from "./AuthDialog";
import AuthInputSelect from "./AuthInputSelect";

const PASSWORD_LENGTH_MIN_LIMIT = 10
const PASSWORD_LENGTH_MAX_LIMIT = 126

const SignupForm: FC = () => {
  const {
    onSignupSuccess,
    onSignupError,
    onGoogleSignupSucess,
    onGoogleSignupError,
    setAuthDialogState,
  } = useContext(AuthContext);

  /** Form schema validation using zod
   *
   * Schema:
   *  - email (required, email)
   *  - password (required, min 6, max 12)
   *  - confirm_password (required, min 6, max 12, should match password)
   *  - company_name
   *  - phone_number
   *  - role
   *  - country
   *
   * For more information about zod, check the documentation: https://zod.dev/
   * */
  const formSchema = z.object({
    email: z.string({
      required_error: "Email is required",
      invalid_type_error: "Email should be a string"
    }).email("Invalid email address"),
    password: z.string({
      required_error: "Password is required",
      invalid_type_error: "Password should be a string"
    }).min(PASSWORD_LENGTH_MIN_LIMIT, `Password length should be at least ${PASSWORD_LENGTH_MIN_LIMIT} characters`)
      .max(PASSWORD_LENGTH_MAX_LIMIT, `Password cannot exceed more than ${PASSWORD_LENGTH_MAX_LIMIT} characters`),
    confirm_password: z.string({
      required_error: "Confirm Password is required",
      invalid_type_error: "Confirm Password should be a string"
    }).min(PASSWORD_LENGTH_MIN_LIMIT, `Password length should be at least ${PASSWORD_LENGTH_MIN_LIMIT} characters`)
      .max(PASSWORD_LENGTH_MAX_LIMIT, `Password cannot exceed more than ${PASSWORD_LENGTH_MAX_LIMIT} characters`),
    company_name: z
      .string({
        required_error: "Company Name is required",
        invalid_type_error: "Company Name should be a string",
      })
      .default(""),
    phone_number: z
      .string({
        required_error: "Phone Number is required",
        invalid_type_error: "Phone Number should be a string",
      })
      .default(""),
    role: z
      .string({
        required_error: "Role is required",
        invalid_type_error: "Role should be a string",
      })
      .default(""),
    country: z
      .string({
        required_error: "Country is required",
        invalid_type_error: "Country should be a string",
      })
      .default(""),
  })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords don't match",
      path: ["confirm_password"], // path of error
    }).superRefine(({ password }, checkPasswordComplexity) => {
      // Password has to have:
      // At least 1 uppercase letter
      const uppercaseRegex = new RegExp("(?=.*[A-Z])")

      // At least 1 lowercase letter
      const lowercaseRegex = new RegExp("(?=.*[a-z])")

      // At least 1 number
      const numberRegex = new RegExp("(?=.*[0-9])")

      // At least 1 special character
      const specialCharacters = "!@#\$%\^&\*+-=~"
      const specialCharacterRegex = new RegExp(`(?=.*[${specialCharacters}])`)

      if (!uppercaseRegex.test(password)) {
        checkPasswordComplexity.addIssue({
          code: "custom",
          message: "Password should contain at least 1 uppercase letter",
          path: ["password"]
        })
        return
      }

      if (!lowercaseRegex.test(password)) {
        checkPasswordComplexity.addIssue({
          code: "custom",
          message: "Password should contain at least 1 lowercase letter",
          path: ["password"]
        })
      }

      if (!numberRegex.test(password)) {
        checkPasswordComplexity.addIssue({
          code: "custom",
          message: "Password should contain at least 1 number",
          path: ["password"]
        })
      }

      if (!specialCharacterRegex.test(password)) {
        checkPasswordComplexity.addIssue({
          code: "custom",
          message: `Password should contain at least 1 special character (${specialCharacters})`,
          path: ["password"]
        })
      }
    })

  type SignUpSchema = z.infer<typeof formSchema>

  const methods = useForm<SignUpSchema>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
  });
  const { handleSubmit } = methods;

  /* const countries = useMemo(
    () => countriesList.map((country) => country.name),
    [],
  ); */
  const roles = useMemo(() => rolesList.map((role) => role.name), []);

  const createAccount = (data: SignUpSchema) => {
    const newUser: NewUser = {
      email: data.email,
      password: data.password,
      userData: {
        name: "",
        email: data.email,
        is_premium: false,
        company_name: data.company_name,
        role: data.role,
      },
    };

    authService.signUp(newUser, onSignupSuccess, onSignupError);
  };

  const handleGoogleSignIn = () => {
    authService.signUpWithGoogle(onGoogleSignupSucess, onGoogleSignupError);
  };

  return (
    <>
      <div className="w-full">
        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={handleSubmit(createAccount)}>
            <div>
              <AuthInput
                id="email"
                type="email"
                name="email"
                label="Email"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <AuthInput
                id="password"
                type="password"
                name="password"
                label="Password"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <AuthInput
                id="confirm-password"
                type="password"
                name="confirm_password"
                label="Confirm password"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex justify-between gap-x-3 border-t border-gray-200 pt-3">
              <AuthInput
                label="Company Name"
                type="text"
                name="company_name"
                id="company-name"
                placeholder="Company Inc."
                required
              />
              <AuthInputSelect
                id="role"
                name="role"
                label="Role"
                options={roles}
                placeholder="Select a role"
                required
              />
            </div>
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
