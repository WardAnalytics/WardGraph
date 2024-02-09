import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { getIsPremiumUser } from "../services/firestore/user/premium";

const useAuthState = () => {
  // Get user from local storage
  const userFromLocalStorage = localStorage.getItem("user");

  const [user, setUser] = useState<User | null>(userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  console.log(user);
  console.log(isAuthenticated);

  useEffect(() => {
    // This listener will be called whenever the user's sign-in state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      localStorage.setItem("user", JSON.stringify(currentUser));
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]); // Empty array ensures this effect runs only once on mount

  useEffect(() => {
    setIsAuthenticated(user?.emailVerified || false);
  }, [user]);

  useEffect(() => {
    getIsPremiumUser().then((result) => {
      setIsPremium(result);
    });
  }, [user]);

  return { user, isAuthenticated, isLoading, isPremium };
};

export default useAuthState;
