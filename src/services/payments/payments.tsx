// This file contains the hooks for creating checkout sessions and customer portals for the Stripe payment system. 
// It uses the Firebase Cloud Functions to create these sessions and portals.
// These cloud functions were created by the Stripe extension for Firebase.
// More info about these cloud functions can be found here: https://github.com/invertase/stripe-firebase-extensions/tree/next/firestore-stripe-payments

import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { db, functions } from "../firebase";

interface CheckoutSessionOptions {
  enabled?: boolean; // If the hook should be enabled. This prevents the hook from fireing if it's not needed
}

/** Creates a checkout session for the given price ID and user ID.
 * 
 * @param priceId Price id from Stripe
 * @param userID User id from Firebase
 * @returns The URL of the checkout session, a loading state, and an error state
 */
export const useCheckoutSessionUrl = (priceId: string, userId: string, {
  enabled,
}: CheckoutSessionOptions = {
    enabled: true,
  }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // This function is used to refetch the checkout session URL
  const createCheckoutSession = () => {
    setLoading(true);

    const checkoutSessionRef = collection(
      db,
      "customers",
      userId,
      "checkout_sessions",
    );

    addDoc(checkoutSessionRef, {
      price: priceId,
      allow_promotion_codes: true,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    }).then((docRef) => {
      onSnapshot(docRef, (doc) => {
        const { error, url } = doc.data() as {
          error?: { message: string };
          url?: string;
        };
        if (error) {
          setError(new Error(error.message));
        }
        if (url) {
          setUrl(url);
        }
      });
    }).catch((error) => {
      setError(error as Error);
    }
    ).finally(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    if (enabled) {
      createCheckoutSession();
    }
  }, [priceId]);

  return { url, loading, error, refetch: createCheckoutSession };

}

/** Options for the customer portal hook */
interface CustomerPortalOptions {
  enabled?: boolean; // If the hook should be enabled. This prevents the hook from fireing if it's not needed
}

/** Creates a customer portal URL for the given user ID.
 *  In this portal, the user can manage their subscription.
 * 
 * @param userID User id from Firebase
 * @param options Options for the hook
 * @returns The URL of the customer portal, a loading state, and an error state
 */
export const useCustomerPortalUrl = (userID: string, {
  enabled,
}: CustomerPortalOptions = {
    enabled: true
  }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // This function is used to refetch the customer portal URL
  const getCustomerPortalUrl = () => {
    setLoading(true);
    try {
      // This cloud function was created by the stripe extension
      const functionRef = httpsCallable(
        functions,
        "ext-firestore-stripe-payments-createPortalLink",
      );

      // Calls the create portal link cloud function
      functionRef({
        customerId: userID,
        returnUrl: window.location.origin,
      }).then((result) => {
        const data = result.data as { url: string };
        if (data.url) {
          setUrl(data.url);
        } else {
          throw new Error("Customer portal URL not found");
        }
      }).catch((error) => {
        setError(error as Error);
      }).finally(() => {
        setLoading(false);
      });
    } catch (error) {
      setError(error as Error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (enabled) {
      getCustomerPortalUrl();
    }

  }, [userID]);

  return { url, loading, error, refetch: getCustomerPortalUrl };
}

