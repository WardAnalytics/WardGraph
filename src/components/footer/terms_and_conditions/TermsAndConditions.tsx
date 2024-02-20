import { FC } from "react";
import termsAndConditionsPDF from "../../../assets/WardAnalytics-Terms-and-Conditions.pdf";

interface TermsAndConditionsProps {
    className?: string;
}

const TermsAndConditions: FC<TermsAndConditionsProps> = ({
    className
}) => {
    return (
        <div className={className}>
            <a href={termsAndConditionsPDF} target="_blank">Terms & Conditions</a>
        </div>
    )
}

export default TermsAndConditions;