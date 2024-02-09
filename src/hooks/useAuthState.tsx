import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { getPremiumStatus } from "../services/firestore/user/premium";

const useAuthState = () => {
  // Get user from local storage

  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // This listener will be called whenever the user's sign-in state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      localStorage.setItem("user", JSON.stringify(currentUser));
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty array ensures this effect runs only once on mount

  useEffect(() => {
    setIsAuthenticated(user?.emailVerified || false);
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    getPremiumStatus().then((status) => {
      setIsPremium(status);
    });
  }, [user]);

  return { user, isAuthenticated, isLoading, isPremium };
};

export default useAuthState;
