import { FC } from "react";
import Socials from "./socials";
import TermsAndConditions from "./terms_and_conditions";

const Footer: FC = () => {
    return (
        <footer className="flex absolute bottom-0 z-10 h-fit w-full justify-between items-center transition-all duration-300 ease-in-out mb-3">
            <Socials className="flex-none ml-3 items-center" />
            <TermsAndConditions className="text-gray-500" />
            {/* Keep this div to maintain the spacing */}
            <div className="flex-none w-20"></div>
        </footer>
    )
}

export default Footer;