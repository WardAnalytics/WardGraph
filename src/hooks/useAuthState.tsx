import { Query, collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { User } from "../services/auth/auth.services";
import { auth, db } from "../services/firebase";
import { UserNotFoundError } from "../services/firestore/user/errors";

/** Retrieves the current authentication state of the user.
 *  This information includes the current user and its ID, and whether the user is authenticated.
 * 
 * @returns An object containing the user, and whether the user is authenticated
 */
const useAuthState = () => {
  // Get user from local storage
  const localUser = localStorage.getItem("user")

  const initialUser: User | null = localUser ? JSON.parse(localUser) : null

  const [user, setUser] = useState<User | null>(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialUser?.emailVerified || false,
  );

  const [isPremium, setIsPremium] = useState<boolean>(initialUser?.userData?.is_premium || false);

  const [userID, setUserID] = useState<string>("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // This listener will be called whenever the user's sign-in state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const newAuthState: User = {
        ...currentUser,
        ...user
      } as User;

      setUser(newAuthState);
      setUserID(currentUser.uid);
      setIsLoading(false);

      localStorage.setItem("user", JSON.stringify(newAuthState));
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty array ensures this effect runs only once on mount

  useEffect(() => {
    const isAuthenticated = user?.emailVerified || false;

    setIsAuthenticated(isAuthenticated);

    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const { uid: userID } = user

    // TODO: Encapsulate this in a function in the firestore service
    let queryRef: Query | null = null;

    try {
      queryRef = query(collection(db, "customers", userID, "subscriptions"), where("status", "in", ["active", "trialing"]));
    } catch (error) {
      setIsLoading(false);
      setError(new UserNotFoundError(userID));
      return;
    }

    const unsubscribe = onSnapshot(
      queryRef,
      (collectionSnap) => {
        let isPremium = false;
        if (collectionSnap.docs.length > 0) {
          isPremium = true;
        }

        setIsPremium(isPremium);

        const newUserAuthState: User = {
          ...user,
          userData: {
            ...user.userData!,
            is_premium: isPremium
          }
        };

        localStorage.setItem("user", JSON.stringify(newUserAuthState));
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        setError(error as Error);
      });

    return () => unsubscribe();
  }, [user]);

  return { user, userID, isAuthenticated, isPremium, isLoading, error };
};

export default useAuthState;
