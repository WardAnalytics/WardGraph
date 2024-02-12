import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { app, auth, db } from "../firebase";
import { getFunctions, httpsCallable } from "firebase/functions";

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
    allow_promotion_codes: true,
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

const getCustomerPortalUrl = async (): Promise<string> => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  let dataWithUrl: any;
  try {
    const functions = getFunctions(app, "europe-west3");
    const functionRef = httpsCallable(
      functions,
      "ext-firestore-stripe-payments-createPortalLink",
    );

    const { data } = await functionRef({
      customerId: userId,
      returnUrl: window.location.origin,
    });

    dataWithUrl = data as { url: string };
  } catch (err) {
    console.error(err);
    throw new Error("Error creating customer portal link");
  }

  return new Promise<string>((resolve, reject) => {
    if (dataWithUrl.url) {
      resolve(dataWithUrl.url);
    } else {
      reject(new Error("Customer portal URL not found"));
    }
  });
};

export { getCheckoutUrl, getCustomerPortalUrl };
