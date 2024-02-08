import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase";

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
    setIsAuthenticated(user?.emailVerified || false);
  }, [user]);

  useEffect(() => {
    const getIsPremiumUser = async () => {
      const isAuthenticated = user?.emailVerified;

      if (!isAuthenticated) {
        setIsPremium(false);
        return;
      }

      const uid = user?.uid;

      if (!uid) {
        setIsPremium(false);
        return;
      }

      // Get the user's subscription status
      // ...

      setIsPremium(true);
    };

    getIsPremiumUser();
  }, [user]);

  return { user, isAuthenticated, isLoading, isPremium };
};

export default useAuthState;
