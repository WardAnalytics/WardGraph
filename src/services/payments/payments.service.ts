import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const getCheckoutUrl = async (priceId: string): Promise<string> => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const checkoutSessionRef = collection(
    db,
    "customers",
    userId,
    "checkout_sessions",
  );

  const docRef = await addDoc(checkoutSessionRef, {
    price: priceId,
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  });

  return new Promise<string>((resolve, reject) => {
    const unsubscribe = onSnapshot(docRef, (doc) => {
      const { error, url } = doc.data() as {
        error?: { message: string };
        url?: string;
      };
      if (error) {
        unsubscribe();
        reject(new Error(error.message));
      }
      if (url) {
        console.log(`Stripe checkout URL: ${url}`);
        unsubscribe();
        resolve(url);
      }
    });
  });
};

export { getCheckoutUrl };
