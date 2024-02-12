import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { getPremiumStatus } from "../services/firestore/user/premium/premium";

/** Retrieves the current authentication state of the user.
 *  This information includes the current user, whether the user is authenticated, and whether the user is a premium user.
 * 
 * @returns An object containing the user, whether the user is authenticated, and whether the user is a premium user
 */
const useAuthState = () => {
  // Get user from local storage
  const localUser = localStorage.getItem("user");
  const initialUser = localUser ? JSON.parse(localUser) : null;
  const localIsPremium = localStorage.getItem("isPremium");
  const initialIsPremium = localIsPremium ? JSON.parse(localIsPremium) : false;

  const [user, setUser] = useState<User | null>(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialUser?.emailVerified || false,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(initialIsPremium);

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
    if (!user) {
      setIsPremium(false);
      return;
    }
    getPremiumStatus(user?.uid).then((status) => {
      setIsPremium(status);
      localStorage.setItem("isPremium", JSON.stringify(status));
    });
  }, [user]);

  return { user, isAuthenticated, isLoading, isPremium };

  return { user, isAuthenticated, isLoading };
};

export default useAuthState;
