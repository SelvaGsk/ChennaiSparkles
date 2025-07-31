//@ts-nocheck
import { useFirebase } from '@/Services/context';
import { CiTrash } from 'react-icons/ci';
import { FiShoppingCart } from 'react-icons/fi';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import CartSummary from "@/components/CartSummary";

const Cart = () => {
  const { cartItems, updateCartQty } = useFirebase();
  const cartArray = Object.values(cartItems || {});
  const totalAmount = cartArray.reduce(
    (acc, item) => acc + item.salesPrice * item.qty,
    0
  );
  const navigate = useNavigate();
  
  const {setting}=useFirebase();
  if(!setting){
    return;
  }

  const minimumOrderValue = setting[0]?.MinOrderValue ?? 0;

  const isMinimumOrderValid = (
    cartTotal: number,
    onFail?: () => void
  ): boolean => {
    if (cartTotal < minimumOrderValue) {
      if (onFail) {
        onFail();
      } else {
        toast.error(`Minimum order value is ₹${minimumOrderValue}. Please add more items.`);
        // alert(`Minimum order value is ₹${minimumOrderValue}. Please add more items to your cart.`);
      }
      return false;
    }
    return true;
  };

  const handleCheckout = () => {
    if (!isMinimumOrderValid(totalAmount)) return;

    navigate('/checkout');
  };

  return (
    <>
      <div className="relative px-4 py-8 sm:px-6 md:px-10 bg-gray-50 min-h-screen">
        <CartSummary/>
        {/* Empty Cart */}
        {cartArray.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 text-center">
            <FiShoppingCart className="text-6xl mb-4" />
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="text-sm mt-2">Start adding some amazing products!</p>
          </div>
        ) : (
          <>
            {/* Table Section */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg text-sm">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="text-left p-4">Product</th>
                    <th className="hidden sm:table-cell text-center p-4">Before Discount</th>
                    <th className="hidden sm:table-cell text-center p-4">Offer Price</th>
                    <th className="text-center p-4">Quantity</th>
                    <th className="text-center p-4">Total</th>
                    <th className="text-center p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartArray.map((item) => (
                    <tr key={item.productId} className="border-b">
                      <td className="flex flex-col sm:flex-row sm:items-center gap-2 p-4">
                        <div className="w-16 h-16 bg-white rounded flex items-center justify-center overflow-hidden">
                          <img
                            src={item.productImageURL}
                            alt={item.productName}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.productName}</p>

                          {/* Show price under name on small screens only */}
                          <div className="sm:hidden mt-1 text-sm">
                            <span className="text-red-500 line-through mr-1">
                              ₹{item.beforeDiscPrice?.toFixed(2)}
                            </span>
                            <span className="text-emerald-600 font-semibold">
                              ₹{item.salesPrice?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell text-center text-red-500 line-through font-semibold">
                        ₹{item.beforeDiscPrice?.toFixed(2)}
                      </td>
                      <td className="hidden sm:table-cell text-center text-emerald-600 font-semibold">
                        ₹{item.salesPrice?.toFixed(2)}
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => updateCartQty(item.productId, 'dec')}
                            className="w-8 h-8 bg-red-500 hover:bg-gradient-to-r from-yellow-400 to-red-500 text-white rounded-full text-lg font-bold"
                          >−</button>
                          <input
                            type="number"
                            min={1}
                            value={item.qty}
                            onChange={(e) => updateCartQty(item.productId, parseInt(e.target.value))}
                            className="w-16 text-center border rounded px-2 py-1"
                          />
                          <button
                            onClick={() => updateCartQty(item.productId, 'inc')}
                            className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-red-500 hover:bg-green-600 text-white rounded-full text-lg font-bold"
                          >+</button>
                        </div>
                      </td>
                      <td className="text-center font-semibold">
                        ₹{(item.salesPrice * item.qty).toFixed(2)}
                      </td>
                      <td className="text-center">
                        <button
                          className="text-red-500 text-2xl"
                          onClick={() => updateCartQty(item.productId, 'dec')}
                        >
                          <CiTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Bottom Summary */}
            {/* <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-300 p-4 flex items-center justify-between lg:hidden">
              <div>
                <p className="text-base font-medium">Total: ₹{totalAmount.toFixed(2)}</p>
              </div>
              <button
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div> */}

            {/* Back to Shop (shown only on large screen below the table) */}
            <div className="hidden lg:flex justify-between items-center mt-6">
              <p
                className="text-sm underline text-gray-700 cursor-pointer hover:text-black"
                onClick={() => navigate('/shop')}
              >
                ← Continue Shopping
              </p>
              <div className="text-right">
                <p className="text-lg font-semibold mb-2">
                  Total: ₹{totalAmount.toFixed(2)}
                </p>
                <button
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2 rounded"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
