import { FC } from "react";
import Socials from "./socials";
import TermsAndConditions from "./terms_and_conditions";

const Footer: FC = () => {
    return (
        <footer className="flex gap-x-2 absolute bottom-0 z-10 text-xs h-fit w-full items-center transition-all duration-300 ease-in-out mb-3">
            <Socials className="flex-none ml-3 items-center" />
            {/* Vertical Separator */}
            <div className="border-r-2 border-gray-400 h-4" />
            <TermsAndConditions className="text-gray-500" />
        </footer>
    )
}

export default Footer;