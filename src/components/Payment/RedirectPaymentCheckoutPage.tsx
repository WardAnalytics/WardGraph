import { FC } from "react";
import StripeCheckout from "./StripeCheckout";
import { useNavigate } from "react-router-dom";

const RedirectPaymentCheckoutPage: FC = () => {
    const navigate = useNavigate()

    const onSuccess = (url: string) => {
        window.location.href = url;
    }

    const onError = (error: any) => {
        console.error(error);
        navigate("/")
    }

    return (
        <StripeCheckout onCheckoutSuccess={onSuccess} onCheckoutError={onError} />
    );
}

export default RedirectPaymentCheckoutPage;

