import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../firebase";

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

export { getAllProducts };
