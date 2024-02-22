import clsx from "clsx";
import { FC } from "react";
import logo from "../../assets/ward-logo-blue.svg";

interface LogoProps {
    className?: string;
}

const Logo: FC<LogoProps> = ({
    className
}) => {
    return (
        <div className={clsx("flex flex-col sm:flex-row items-center justify-center gap-x-7 gap-y-4 text-2xl", className)}>
            <img src={logo} className="max-h-16" alt="Ward Analytics" />
            <h1 className="text-4xl sm:text-5xl text-center font-bold font-montserrat text-[#4268ff]">Ward Analytics</h1>
        </div>
    )
}

export default Logo