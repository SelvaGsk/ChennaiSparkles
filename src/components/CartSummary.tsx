// components/CartSummary.tsx
import { useFirebase } from "@/Services/context";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface CartSummaryProps {
  className?: string;
}

export const calculateTotalAmount = (cartItems: any) => {
  const cartArray = Object.values(cartItems || {});
  return cartArray.reduce((acc: number, item: any) => acc + item.salesPrice * item.qty, 0);
};

export const getMinimumOrderValue = (setting: any[]) => {
  return setting?.[0]?.MinOrderValue ?? 0;
};

export const isMinimumOrderValid = (
  totalAmount: number,
  minimumOrderValue: number,
  onFail?: () => void
): boolean => {
  if (totalAmount < minimumOrderValue) {
    if (onFail) {
      onFail();
    } else {
      toast.error(`Minimum order value is ₹${minimumOrderValue}. Please add more items.`);
    }
    return false;
  }
  return true;
};

const CartSummary: React.FC<CartSummaryProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const { cartItems, setting } = useFirebase();
  const totalAmount = calculateTotalAmount(cartItems);
  const minimumOrderValue = getMinimumOrderValue(setting);

  const handleCheckout = () => {
    if (!isMinimumOrderValid(totalAmount, minimumOrderValue)) return;
    navigate("/checkout");
  };

  const cartArray = Object.values(cartItems || {});
  if (cartArray.length === 0) return null;

  return (
    <div
      className={`fixed bottom-6 right-4 z-50 w-[90%] sm:w-auto sm:min-w-[300px] bg-white border border-gray-200 shadow-xl rounded-2xl px-4 py-3 flex items-center justify-between gap-4 ${className}`}
    >
      <div>
        <p className="text-gray-800 font-semibold text-base sm:text-lg">
          Total: ₹{totalAmount.toFixed(2)}
        </p>
      </div>
      <button
        onClick={handleCheckout}
        className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm sm:text-base px-4 py-2 rounded-full shadow-md"
      >
        Checkout
      </button>
    </div>
  );
};

export default CartSummary;
