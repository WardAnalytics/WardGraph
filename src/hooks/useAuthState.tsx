import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase";

const useAuthState = () => {
  // Get user from local storage
  const localUser = localStorage.getItem("user");
  const initialUser = localUser ? JSON.parse(localUser) : null;

  const [user, setUser] = useState<User | null>(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialUser?.emailVerified || false,
  );
  const [isLoading, setIsLoading] = useState(true);

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

  return { user, isAuthenticated, isLoading };
};

export default useAuthState;
