//@ts-nocheck

import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "@/Services/Firebase.config";
import { useFirebase } from "@/Services/context";
import { ProductCard } from "./Shop";
import { CiHeart } from "react-icons/ci"; // for empty wishlist icon
import Footer from "@/components/Footer";

const WishList = () => {
  const { user, wishlistIds } = useFirebase();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const productRef = ref(database, "CSC/Products");
    get(productRef).then((snapshot) => {
      const allProducts = snapshot.val();
      if (allProducts && wishlistIds.length > 0) {
        const filtered = Object.entries(allProducts)
          .filter(([id]) => wishlistIds.includes(id))
          .map(([id, data]) => ({ id, ...data }));
        setProducts(filtered);
      } else {
        setProducts([]);
      }
    });
  }, [wishlistIds]);

  if (products.length === 0) {
    return (<>
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <CiHeart className="text-6xl text-gray-400 mb-4" />
        <p className="text-lg text-gray-600">Your wishlist is empty</p>
        <p className="text-sm text-gray-400">Start adding products you love</p>
      </div>
    <Footer/>
     </>
    );
  }

  return (<>
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
    <Footer/>
    </>
  );
};

export default WishList;
