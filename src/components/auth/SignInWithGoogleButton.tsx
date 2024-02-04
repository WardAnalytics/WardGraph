import { FC } from "react";

interface SignInWithGoogleButtonProps {
  text: string;
  handleGoogleSignIn: () => void;
}

const SignInWithGoogleButton: FC<SignInWithGoogleButtonProps> = ({
  text,
  handleGoogleSignIn,
}) => {
  return (
    <p className="mt-4 text-center text-sm text-gray-500">
      <button
        className="flex w-full justify-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 transition duration-150 hover:border-slate-400 hover:shadow dark:border-slate-700 dark:bg-white dark:hover:border-slate-500 dark:hover:bg-slate-100"
        onClick={handleGoogleSignIn}
      >
        <img
          className="h-6 w-6"
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          loading="lazy"
          alt="google logo"
        />
        <span>{text}</span>
      </button>
    </p>
  );
};

export default SignInWithGoogleButton;
