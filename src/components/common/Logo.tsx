import { FC } from "react";
import logo from "../../assets/ward-logo-blue-full.svg";
import darkModeLogo from "../../assets/ward-logo-white-full.svg";

const Logo: FC = () => {
    return (
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
                className="mx-auto h-10 w-auto dark:hidden"
                src={logo}
                alt="Ward Analytics"
            />
            <img
                className="mx-auto h-10 w-auto hidden dark:block"
                src={darkModeLogo}
                alt="Ward Analytics"
            />
        </div>
    )
}

export default Logo