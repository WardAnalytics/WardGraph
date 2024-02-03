import { FC } from "react";

interface SignInWithGoogleButtonProps {
    text: string
    handleGoogleSignIn: () => void;
}

const SignInWithGoogleButton: FC<SignInWithGoogleButtonProps> = ({
    text,
    handleGoogleSignIn }) => {
    return (
        <p className="mt-4 text-center text-sm text-gray-500">
            <button
                className="flex w-full justify-center px-3 py-1.5 border gap-2 border-slate-200 dark:bg-white dark:hover:bg-slate-100 dark:border-slate-700 rounded-lg text-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow transition duration-150"
                onClick={handleGoogleSignIn}>
                <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                <span>{text}</span>
            </button>
        </p>
    )
}

export default SignInWithGoogleButton;