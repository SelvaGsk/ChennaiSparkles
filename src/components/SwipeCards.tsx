// @ts-nocheck
import React, { useState, useEffect } from "react";
// import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useFirebase } from "@/Services/context";
// import { MdOutlineDownloadForOffline } from "react-icons/md";
import { ProductCardComponent } from "./ProductCard";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import { Button } from "./ui/button";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

const SwipeCards = () => {
  const [multiBrandProducts, setMultiBrandProducts] = useState([]);
  const [standardProducts, setStandardProducts] = useState([]);
  const [stack1, setStack1] = useState([]);
  const [stack2, setStack2] = useState([]);
  const [stack3, setStack3] = useState([]);

  const { getgiftProducts, getStandardGiftProducts, toggleCart } = useFirebase();

  const getRandomStack = (arr, count = 3, avoidIds = []) => {
    const filtered = arr.filter(item => !avoidIds.includes(item.id));
    const base = filtered.length >= count ? filtered : arr;
    const shuffled = [...base].sort(() => Math.random() - 0.5);
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(shuffled[i % shuffled.length]);
    }
    return result;
  };

  // const normalizeCards = (arr) => {
  //   if (arr.length === 0) return [];
  //   if (arr.length === 1) return [arr[0], arr[0], arr[0]];
  //   if (arr.length === 2) return [arr[0], arr[1], arr[0]];
  //   return [...arr];
  // };

  const normalizeProducts = (arr) => {
    if (arr.length === 0) return [];
    if (arr.length === 1) return [arr[0], arr[0], arr[0]];
    if (arr.length === 2) return [arr[0], arr[1], arr[0]];
    return [...arr];
  };

  useEffect(() => {
    const fetchData = async () => {
      const multiBrand = await getgiftProducts();
      const standard = await getStandardGiftProducts();

      setMultiBrandProducts(multiBrand);
      setStandardProducts(standard);
    };
    fetchData();
  }, []);

  // Independent stack reset handlers
  const resetStack = async (setter) => {
    const products = await getgiftProducts();
    const standardproducts = await getStandardGiftProducts();
    // Normalize both sets of products
    const normalizedMultiBrandProducts = normalizeProducts(products);
    const normalizedStandardProducts = normalizeProducts(standardProducts);
    
    // You can now use them separately if needed in different stacks or categories
    setter({
      multiBrand: getRandomStack(normalizedMultiBrandProducts),
      standard: getRandomStack(normalizedStandardProducts),
    });
  };

  // Stack 1 reset
  useEffect(() => {
    if (stack1.length === 0) {
      const timeout = setTimeout(() => resetStack(setStack1), 500);
      return () => clearTimeout(timeout);
    }
  }, [stack1]);

  // Stack 2 reset
  useEffect(() => {
    if (stack2.length === 0) {
      const timeout = setTimeout(() => resetStack(setStack2), 1000);
      return () => clearTimeout(timeout);
    }
  }, [stack2]);

  // Stack 3 reset
  useEffect(() => {
    if (stack3.length === 0) {
      const timeout = setTimeout(() => resetStack(setStack3), 1500);
      return () => clearTimeout(timeout);
    }
  }, [stack3]);

  // if(cards.length<=0)return;
  // console.log(cards);

  return (
    <>
      {/* Multi Brand Section */}
      <h1 className="font-bold text-2xl ml-10 mt-2">✨ Family Pack - Multi Brand</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {normalizeProducts(multiBrandProducts).map((gift, index) => (
          <div key={index}>
            <GiftCardComponent product={gift} />
          </div>
        ))}
      </div>

      {/* Standard Section */}
      <h1 className="font-bold text-2xl ml-10 mt-2">✨ Family Pack - Standard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {normalizeProducts(standardProducts).map((gift, index) => (
          <div key={index}>
            <GiftCardComponent product={gift} />
          </div>
        ))}
      </div>
    </>
  );
};

// const Card = ({ product, cards, setCards, index, toggleCart, autoSwipeDelay }) => {
//   const { productImageURL } = product;
//   const x = useMotionValue(0);
//   const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
//   const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

//   const isFront = index === cards.length - 1;

//   const rotate = useTransform(() => {
//     const offset = isFront ? 0 : index % 2 ? 6 : -6;
//     return `${rotateRaw.get() + offset}deg`;
//   });

//   const handleDragEnd = () => {
//     setCards((prev) => prev.slice(0, -1));
//   };

//   useEffect(() => {
//     if (!isFront) return;

//     const timeout = setTimeout(() => {
//       animate(x, 200, {
//         duration: 0.4,
//         onComplete: () => handleDragEnd(),
//       });
//     }, autoSwipeDelay || 3000);

//     return () => clearTimeout(timeout);
//   }, [isFront]);

//   const zIndex = 10 + index;
//   const scale = isFront ? 1 : index === cards.length - 2 ? 0.95 : 0.9;
//   const translateY =
//     index === cards.length - 2
//       ? "-translate-y-2"
//       : index === cards.length - 3
//       ? "-translate-y-4"
//       : "";

//   return (
//     <motion.div
//       className={`absolute top-0 left-0 right-0 mx-auto h-fit w-72 origin-bottom rounded-lg bg-white shadow-md overflow-hidden transition-transform ${translateY}`}
//       style={{
//         x,
//         opacity,
//         rotate,
//         scale,
//         zIndex,
//       }}
//       animate={{
//         scale: isFront ? 1 : scale,
//       }}
//       drag={isFront ? "x" : false}
//       dragConstraints={{ left: 0, right: 0 }}
//       onDragEnd={() => {
//         if (Math.abs(x.get()) > 100) {
//           handleDragEnd();
//         }
//       }}
//     >
//       {/* <img
//         src={productImageURL}
//         alt="Card"
//         className="h-full w-full object-contain"
//       /> */}
//       <ProductCard product={product} />

      // <a
      //   href={product.pdfurl}
      //   target="_blank"
      //   rel="noopener noreferrer"
      //   className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-red-500 text-white p-2 rounded-full hover:bg-black transition"
      //   title="Download"
      // >
      //   <MdOutlineDownloadForOffline />
      // </a>

//       {/* <button
//         className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-yellow-400 to-red-500 text-white rounded shadow hover:bg-blue-700 transition"
//         onClick={() => toggleCart(product)}
//       >
//         Add to Cart
//       </button> */}
//     </motion.div>
//   );
// };

export default SwipeCards;
export const GiftCard = React.memo(({ product }) => {
  const { toggleWishList, wishlistIds, toggleCart, cartItems, updateCartQty } =
    useFirebase();
  const isInWishlist = wishlistIds.includes(product.id);
  const currentProduct = cartItems?.[product.productId];
  const qty = currentProduct?.qty || 0;

  const [showZoom, setShowZoom] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const productImages = [
    product.productImageURL,
    product.productImageURL2,
    product.productImageURL3,
    product.productImageURL4,
    product.productImageURL5,
  ].filter(Boolean);

  return (
    <>
      <GiftCardComponent product={product} />
    </>
  );

  <Footer />;
});
export const GiftCardComponent: React.FC<ProductCardProps> = React.memo(({ product }) => {
  const { toggleCart, cartItems, updateCartQty, toggleWishList, wishlistIds } = useFirebase();
  const productImages = [product.productImageURL, product.productImageURL2,product.productImageURL3, product.productImageURL4, product.productImageURL5].filter(Boolean);
  const isInWishlist = wishlistIds.includes(product.id);
  const currentProduct = cartItems?.[product.productId];
  const qty = currentProduct?.qty || 0;

  const [showZoom, setShowZoom] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // Auto-switch images every 2s if more than one
  useEffect(() => {
    if (productImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % productImages.length);
      console.log("wer");
    }, 2000);
    return () => clearInterval(interval);
  }, [productImages]);

  return (
    <>
      <div className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col relative">
        {/* Out of Stock Badge */}
        {!product.active && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-red-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
            Out of Stock
          </div>
        )}

        {/* Product Image with Flicker */}
        <div className="w-full h-[250px] flex items-center justify-center bg-white mb-3 rounded-md overflow-hidden relative cursor-pointer">
          <img
            src={productImages[activeImage]}
            alt={product.productName}
            className={`absolute inset-0 m-auto max-h-full max-w-full object-contain transition-opacity duration-500 ${
              !product.active ? 'opacity-50 grayscale' : ''
            }`}
            onClick={() => setShowZoom(true)}
          />
        </div>

        {/* Product Name */}
        <div className="text-center mb-2">
          <p className="text-sm text-gray-500 line-clamp-2">{product.productName}</p>
        </div>

        {/* Pricing */}
        <div className="text-center mb-2">
          <div>
            {/* <span className="text-red-500 line-through">
              ₹{product.beforeDiscPrice?.toFixed(2)}
            </span> */}
            <span className="text-emerald-600 font-bold ml-2">
              ₹{product.salesPrice?.toFixed(2)}
            </span>
          </div>
          {qty > 0 && (
            <div className="inline-block mt-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full shadow-inner border border-emerald-200">
              Total: ₹{(qty * product.salesPrice).toFixed(2)}
            </div>
          )}
        </div>

        {/* PDF Download Button */}
        <a
          href={product.pdfurl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-red-500 text-white p-2 rounded-full hover:bg-black transition"
          title="Download"
        >
          <MdOutlineDownloadForOffline />
        </a>

        {/* Actions */}
        <div className="mt-auto flex justify-between items-center">
          {/* YouTube */}
          {product.youtubeURL && (
            <a href={product.youtubeURL} target="_blank" rel="noopener noreferrer">
              <FaYoutube className="text-red-500 text-3xl cursor-pointer" />
            </a>
          )}

          {/* Quantity + Add to Cart */}
          {qty > 0 && product.active ? (
            <div className="flex items-center mx-auto gap-2">
              <button
                onClick={() => updateCartQty(product.productId, 'dec')}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => updateCartQty(product.productId, parseInt(e.target.value))}
                className="w-16 text-center border rounded px-2 py-1"
              />
              <button
                onClick={() => updateCartQty(product.productId, 'inc')}
                className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-red-500 text-white rounded"
              >
                +
              </button>
            </div>
          ) : product.active ? (
            <Button
              className="bg-gradient-to-r from-yellow-400 to-red-500 text-white px-6 py-2 rounded-full mx-auto"
              onClick={() => toggleCart(product)}
            >
              Add To Cart
            </Button>
          ) : (
            <span className="text-sm text-gray-400 italic mx-auto">Not Available</span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={() => {
              toggleWishList(product.id);
              toast.success(
                isInWishlist
                  ? 'Product is removed from wishlist'
                  : 'Product is added to wishlist'
              );
            }}
          >
            {isInWishlist ? (
              <FaHeart className="text-2xl text-red-500" />
            ) : (
              <CiHeart className="text-3xl" />
            )}
          </button>
        </div>
      </div>

      {/* Zoom Dialog */}
      {showZoom && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setShowZoom(false)}
        >
          <div
            className="relative bg-white p-2 rounded-md max-w-[90%] max-h-[90%] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={productImages[activeImage]}
              alt={`Zoom ${product.productName}`}
              className="max-h-[80vh] object-contain rounded mb-2"
            />
            {productImages.length > 1 && (
              <div className="flex gap-2 mt-1">
                {productImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumb ${idx}`}
                    onClick={() => setActiveImage(idx)}
                    className={`w-14 h-14 object-cover rounded border cursor-pointer ${
                      activeImage === idx ? 'border-green-500' : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-sm rounded-full"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
});