import {
  getProducts,
  getStripePayments,
} from "@invertase/firestore-stripe-payments";
import { app } from "../firebase/firebase";

const payments = getStripePayments(app, {
  productsCollection: "products",
  customersCollection: "customers",
});

const products = await getProducts(payments, {
  includePrices: true,
  activeOnly: true,
});
for (const product of products) {
  // ...
}
