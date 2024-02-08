import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { getIsPremiumUser } from "../services/auth/users.services";
import { auth } from "../services/firebase/firebase";

const useAuthState = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        // This listener will be called whenever the user's sign-in state changes
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []); // Empty array ensures this effect runs only once on mount

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setIsAuthenticated(currentUser?.emailVerified || false);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        getIsPremiumUser().then((isPremium) => {
            setIsPremium(isPremium);
            setIsLoading(false);
        });
    }, [user]);

    return { user, isAuthenticated, isLoading, isPremium };
};

export default useAuthState;