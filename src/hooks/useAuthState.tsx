import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase";

const useAuthState = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

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
        setIsAuthenticated(user?.emailVerified || false);
    }, [user]);

    return { user, isAuthenticated, isLoading };
};

export default useAuthState;