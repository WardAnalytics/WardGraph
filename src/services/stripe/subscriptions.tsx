import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

interface UserSubscriptionOptions {
    enabled?: boolean; // If the hook should be enabled. This prevents the hook from fireing if it's not needed
}

export interface Subscription {
    id: string;
    name: string;
    description: string;
    price: Price;
}

interface Price {
    id: string;
    amount: number;
}

export const useActiveSubscription = ({ enabled }: UserSubscriptionOptions = { enabled: true }) => {
    const [subscription, setSubscription] = useState<Subscription | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const getSubscriptionPrice = async (subscription: Subscription) => {
        const priceQuery = query(collection(db, "products", subscription.id, "prices"), where("active", "==", true), limit(1));


        const priceSnap = await getDocs(priceQuery);
        if (priceSnap.empty) {
            throw new Error("No active prices found for subscription");
        }

        const priceData = priceSnap.docs[0].data();
        const price: Price = {
            id: priceSnap.docs[0].id,
            amount: priceData.unit_amount / 100,
        };

        subscription.price = price;

        return subscription;
    }

    const getSubscription = async () => {
        const queryRef = query(collection(db, "products"), where("active", "==", true));
        const collectionSnap = await getDocs(queryRef);

        for (const doc of collectionSnap.docs) {
            const subscriptionObj = doc.data() as Subscription;
            subscriptionObj.id = doc.id;

            const subscription = await getSubscriptionPrice(subscriptionObj);

            return subscription;
        }

        return null;
    }

    useEffect(() => {
        if (enabled) {
            setLoading(true);

            getSubscription().then((subscription) => {
                if (subscription) {
                    setSubscription(subscription);
                }
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                setError(error as Error);
            });
        }
    }, []);

    return { subscription, loading, error };

}