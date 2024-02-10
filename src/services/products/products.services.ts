import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    query,
    where,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: Price;
}

interface Price {
  id: string;
  amount: number;
}

const getAllProducts = async () => {
  const q = query(
    collection(db, "products"),
    where("active", "==", true),
    limit(1),
  );

  const productSnapshot = await getDocs(q);

  let products: Product[] = [];

  for (const prodDoc of productSnapshot.docs) {
    const productData = prodDoc.data();

    const productRef = prodDoc.ref;
    const pricesQuery = query(
      collection(productRef, "prices"),
      where("active", "==", true),
      limit(1),
    );

    const priceSnapshot = await getDocs(pricesQuery);
    priceSnapshot.forEach((priceDoc) => {
      const priceData = priceDoc.data();

      const product: Product = {
        id: productRef.id,
        name: productData.name,
        description: productData.description,
        price: {
          id: priceDoc.id,
          amount: priceData.unit_amount / 100,
        },
      };

      products.push(product);
    });
  }
  return products;
};

const getProduct = async (productId: string) => {
  const docRef = doc(db, "products", productId);

  const productSnapshot = await getDoc(docRef);

  if (productSnapshot.exists()) {
    const productData = productSnapshot.data();

    const productRef = productSnapshot.ref;
    const pricesQuery = query(
      collection(productRef, "prices"),
      where("active", "==", true),
      limit(1),
    );

    const priceSnapshot = await getDocs(pricesQuery);
    for (const priceDoc of priceSnapshot.docs) {
      const priceData = priceDoc.data();

      const product: Product = {
        id: docRef.id,
        name: productData.name,
        description: productData.description,
        price: {
          id: priceDoc.id,
          amount: priceData.unit_amount / 100,
        },
      };

      console.log(product);
      return product;
    }
  }
  return null;
};

const getUserProducts = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    return [];
  }

  const q = query(
    collection(db, "customers", userId, "subscriptions"),
    where("status", "in", ["active", "trialing"]),
    limit(1),
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    let products: Product[] = [];
    for (const doc of querySnapshot.docs) {
      const data = doc.data().items[0].plan;

      const product = await getProduct(data.product);
      products.push(product!);
    }
    return products;
  }
  return [];
};

export { getAllProducts, getUserProducts };
