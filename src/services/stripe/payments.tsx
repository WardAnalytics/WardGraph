// This file contains the hooks for creating checkout sessions and customer portals for the Stripe payment system. 
// It uses the Firebase Cloud Functions to create these sessions and portals.
// These cloud functions were created by the Stripe extension for Firebase.
// More info about these cloud functions can be found here: https://github.com/invertase/stripe-firebase-extensions/tree/next/firestore-stripe-payments

import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useEffect, useMemo, useState } from "react";
import { db, functions } from "../firebase";

interface CheckoutSessionOptions {
  enabled?: boolean; // If the hook should be enabled. This prevents the hook from fireing if it's not needed
  successPath?: string; // The path to redirect to after a successful payment
  cancelPath?: string; // The path to redirect to after a canceled payment
}

/** Creates a checkout session for the given price ID and user ID.
 * 
 * @param priceId Price id from Stripe
 * @param userID User id from Firebase
 * @returns The URL of the checkout session, a loading state, and an error state
 */
export const useCheckoutSessionUrl = (priceId: string, userId: string, {
  enabled,
  successPath,
  cancelPath,
}: CheckoutSessionOptions = {
    enabled: true,
    successPath: "",
    cancelPath: "",
  }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // The URL to redirect to after a successful payment
  const successRedirectUrl = useMemo(() => {
    const success_host = window.location.origin;
    return successPath ? `${success_host}/${successPath}` : success_host;
  }, [successPath]);

  // The URL to redirect to after a canceled payment
  const cancelRedirectUrl = useMemo(() => {
    const cancel_host = window.location.origin;
    return cancelPath ? `${cancel_host}/${cancelPath}` : cancel_host;
  }, [cancelPath]);

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
      success_url: successRedirectUrl,
      cancel_url: cancelRedirectUrl
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
          setLoading(false);
        }
      });
    }).catch((error) => {
      setError(error as Error);
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
          setLoading(false);
        } else {
          setLoading(false);
          throw new Error("Customer portal URL not found");
        }
      }).catch((error) => {
        setError(error as Error);
      })
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

