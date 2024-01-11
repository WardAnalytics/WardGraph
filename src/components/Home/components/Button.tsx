import { twMerge } from "tailwind-merge";
import { FC, ReactNode } from "react";

interface ButtonProps {
    type?: "button" | "submit" | "reset" | undefined
    onClick?: () => void
    children?: ReactNode
    className?: string
}

const Button: FC<ButtonProps> = ({
    type = "button",
    onClick = () => { },
    children,
    className = ""
}) => {
    return <>
        <button type={type} onClick={onClick} className={twMerge("font-bold rounded", className)}>{children}</button>
    </>;
}

export default Button;