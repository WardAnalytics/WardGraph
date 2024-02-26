import { FC, useState } from "react";
import Banner from ".";
import LoginDialog from "../auth";

const LoginBanner: FC = () => {
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState<boolean>(false);

    return (
        <>
            <Banner>
                <p className="text-xs leading-6 text-gray-900">
                    <strong className="font-semibold">Unlimited Searches</strong>
                    <svg
                        viewBox="0 0 2 2"
                        className="mx-2 inline h-0.5 w-0.5 fill-current"
                        aria-hidden="true"
                    >
                        <circle cx={1} cy={1} r={1} />
                    </svg>
                    Register now for free, unlimited graph lookups
                </p>
                <a
                    className="flex-none cursor-pointer rounded-full bg-gray-900 px-3.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                    onClick={() => setIsLoginDialogOpen(true)}
                >
                    Sign In / Up <span aria-hidden="true">&rarr;</span>
                </a>
            </Banner>
            <LoginDialog
                isOpen={isLoginDialogOpen}
                setIsOpen={setIsLoginDialogOpen}
            />
        </>
    )
}

export default LoginBanner;