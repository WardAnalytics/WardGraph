import { CollectionReference, Timestamp, addDoc, collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { db } from "../../../firebase";
import { USERS_COLLECTION } from "../constants";
import { usePremiumStatus } from "../premium";

interface FreeUsageInteraction {
    timestamp: Timestamp;
    userID: string;
    type: string;
}


// The time interval for the free usage of the "Expand with AI" feature
const FREE_USAGE_EXPAND_WITH_AI_TIME_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds
// The limit for the free usage of the "Expand with AI" feature, between the time interval
const FREE_USAGE_EXPAND_WITH_AI_LIMIT = 5;

const EXPAND_WITH_AI_TYPE = "expandWithAI";

/** Adds a free tier "Expand with AI" interaction to the user's document
 * 
 * @param userID - The user's ID
 */
export const addFreeTierExpandWithAIInteraction = async (
    userID: string
) => {
    const interaction = {
        timestamp: Timestamp.now(),
        userID,
        type: EXPAND_WITH_AI_TYPE,
    } as FreeUsageInteraction;

    // Get user document ref
    const collectionRef = collection(db, USERS_COLLECTION, userID, "freeUsage");

    const currentUsage = parseInt(localStorage.getItem("expandWithAIUsage") || "0");

    localStorage.setItem("expandWithAIUsage", (currentUsage + 1).toString());

    // Update the user document
    await addDoc(collectionRef, interaction);
}

/** Gets the usage of the "Expand with AI" feature for the free tier
 * 
 * @param userID - The user's ID
 * @returns - The usage of the "Expand with AI" feature, a loading state, an error state, and whether the user has reached the usage limit
 */
export const useFreeTierExpandWithAIUsage = (userID: string) => {
    const { isPremium } = usePremiumStatus(userID);

    const initialUsage = localStorage.getItem("expandWithAIUsage");

    const [usage, setUsage] = useState<number>(initialUsage ? parseInt(initialUsage) : 0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const hasReachedUsageLimit = useMemo(() => {
        return usage >= FREE_USAGE_EXPAND_WITH_AI_LIMIT;
    }, [usage]);


    useEffect(() => {
        // If the user is premium, they have unlimited usage
        if (isPremium || hasReachedUsageLimit) {
            setLoading(false);
            return;
        }

        let collectionRef: CollectionReference | null;

        try {
            collectionRef = collection(db, USERS_COLLECTION, userID, "freeUsage");
        } catch (error) {
            setLoading(false);
            setError(error as Error);
            return;
        }

        // Get the number of interactions between the time interval
        const q = query(collectionRef, where("timestamp", ">", Timestamp.fromMillis(Date.now() - FREE_USAGE_EXPAND_WITH_AI_TIME_INTERVAL)), where("type", "==", EXPAND_WITH_AI_TYPE));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const usage = snapshot.docs.length;
                setUsage(usage);
                setLoading(false);
            },
            (error) => {
                setLoading(false);
                setError(error);
            }
        );

        return () => {
            unsubscribe();
        }
    }, [userID, isPremium, hasReachedUsageLimit]);

    return { usage, loading, error, hasReachedUsageLimit };
}
