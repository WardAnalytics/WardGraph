// import { collection, onSnapshot, query } from "firebase/firestore";
// import { db } from "../../../firebase";
// import { getVerifiedUser } from "../../../auth/auth.services";
// import { User } from "firebase/auth";

// export enum Subscription {
//   TRIAL = "trial",
//   PRO = "pro",
//   ENTERPRISE = "enterprise",
// }

// /** Returns all the current subscriptions for the user.
//  * @returns The user's subscriptions
//  */

// export async function getUserSubscriptions(): Promise<Subscription[]> {
//   const user: User = getVerifiedUser();

//   const subscriptionsRef = collection(db, "users", user.uid, "subscriptions");
//   const q = query(subscriptionsRef);
//   const subscriptions: Subscription[] = [];

// }

// export { getPremiumStatus };
