import { FC } from 'react';
import useAuthState from '../../hooks/useAuthState';
import { getCheckoutUrl, getCustomerPortalUrl } from '../../services/payments/payments.services';

const SubscriptionDisplay: FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mt-4">Subscription Manager</h1>
            <p className="text-lg mt-4">
                Manage your subscription here. Change your plan, billing details, and
                more.
            </p>
            <button
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                    getCustomerPortalUrl().then((url) => {
                        window.location.href = url;
                    });
                }}
            >
                Manage Subscription
            </button>
        </div>
    );
}

const SubscriptionManagerPage = () => {
    const { isPremium } = useAuthState();

    return (
        isPremium ?
            <SubscriptionDisplay /> :

            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold mt-4">Subscription Manager</h1>
                <p className="text-lg mt-4">
                    Buy a subscription to manage it here. Change your plan, billing details, and
                    more.
                </p>
                <button
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        const priceId = import.meta.env.VITE_STRIPE_ONE_MONTH_SUBSCRIPTION_PRICE_ID
                        getCheckoutUrl(priceId).then((url) => {
                            window.location.href = url;
                        });
                    }}
                >
                    Buy Subscription
                </button>
            </div>

    )
}

export default SubscriptionManagerPage;
