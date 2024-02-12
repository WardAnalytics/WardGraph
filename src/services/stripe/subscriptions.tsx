import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

interface UserSubscriptionsOptions {
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

export const useActiveSubscriptions = ({ enabled }: UserSubscriptionsOptions = { enabled: true }) => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const getProductPrice = async (subscription: Subscription) => {
        const priceQuery = query(collection(db, "products", subscription.id, "prices"), where("active", "==", true), limit(1));


        const priceSnap = await getDocs(priceQuery);
        if (priceSnap.empty) {
            throw new Error("No active prices found for product");
        }

        const priceData = priceSnap.docs[0].data();
        const price: Price = {
            id: priceSnap.docs[0].id,
            amount: priceData.unit_amount / 100,
        };

        subscription.price = price;

        return subscription;
    }

    const getSubscriptions = async () => {
        const subscriptions: Subscription[] = [];

        const queryRef = query(collection(db, "products"), where("active", "==", true));
        const collectionSnap = await getDocs(queryRef);

        for (const doc of collectionSnap.docs) {
            const subscription = doc.data() as Subscription;
            subscription.id = doc.id;

            const newSubscription = await getProductPrice(subscription);
            subscriptions.push(newSubscription);
        }

        return subscriptions;
    }

    useEffect(() => {
        if (enabled) {
            setLoading(true);

            getSubscriptions().then((subscriptions) => {
                setSubscriptions(subscriptions);
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                setError(error as Error);
            });
        }
    }, []);

    return { subscriptions, loading, error };

}