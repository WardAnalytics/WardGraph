import { FC, useEffect } from "react";

import { useCreateCheckoutSession } from "../../api/payments/checkout/checkout";
import LoadingPageTemplate from "../../templates/LoadingPage";

interface StripeCheckoutProps {
    onCheckoutSuccess: (data: string) => void;
    onCheckoutError: (error: any) => void;
}

const StripeCheckout: FC<StripeCheckoutProps> = ({
    onCheckoutSuccess,
    onCheckoutError
}) => {
    const { mutate: submitPaymentRequest } = useCreateCheckoutSession({
        mutation: {
            onSuccess: (data) => {
                onCheckoutSuccess(data.url);
            },
            onError: (error) => {
                console.error(error);
                onCheckoutError(error);
            }
        }
    });

    useEffect(() => {
        submitPaymentRequest();
    }, []);

    return (
        <LoadingPageTemplate title="Loading Payment Checkout Page..." />
    )
}

export default StripeCheckout;