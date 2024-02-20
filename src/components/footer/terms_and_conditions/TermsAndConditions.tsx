import { FC } from "react";

interface TermsAndConditionsProps {
    className?: string;
}

const TermsAndConditions: FC<TermsAndConditionsProps> = ({
    className
}) => {
    return (
        <div className={className}>
            <a href="/terms-and-conditions">Terms and Conditions</a>
        </div>
    )
}

export default TermsAndConditions;