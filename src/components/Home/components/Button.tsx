import { twMerge } from "tailwind-merge";
import { FC } from "react";

interface ButtonProps {
    type?: "button" | "submit" | "reset" | undefined
    onClick?: () => void
    text: string
    className?: string
}

const Button: FC<ButtonProps> = ({
    type = "button",
    onClick = () => { },
    text,
    className = ""
}) => {
    return <>
        <button type={type} onClick={onClick} className={twMerge("font-bold rounded", className)}>
            {text}
        </button>
    </>;
}

export default Button;