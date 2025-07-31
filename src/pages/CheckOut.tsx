//@ts-nocheck


import { useFirebase } from "@/Services/context";
import React, { useEffect, useState } from "react";
import { CiTrash } from "react-icons/ci";
import { useForm } from "react-hook-form";
import Footer from "@/components/Footer";
import { get, ref } from "firebase/database";
import { database } from "@/Services/Firebase.config.js";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CheckOut = () => {
  const { cartItems, getUser, user, placeOrder } = useFirebase();
  const cartArray = Object.values(cartItems || {});
  const [excludedIds, setExcludedIds] = useState<string[]>([]);
  const [dbUser, setdbUser] = useState();
  const [packageCharge, setdpackageCharge] = useState(0);
  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [formData, setFormData] = useState();
  const [showDialog, setShowDialog] = useState(false);
 
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const pinCode = watch("pinCode");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pinError, setPinError] = useState("");

  const getPackgeCost = async () => {
    const userRef = ref(database, `CSC/Settings`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) return;
    const item = snapshot.val();
    setdpackageCharge(item[0].packageCharge);
  };

  useEffect(() => {
    const getUse = async () => {
      const u = await getUser();
      setdbUser(u);
    };
    getUse();
    getPackgeCost();
  }, [user]);

  useEffect(() => {
    const fetchLocation = async () => {
      if (pinCode?.length === 6) {
        setLoadingLocation(true);
        setPinError("");
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`);
          const data = await res.json();
          if (data[0].Status === "Success") {
            console.log(data[0].PostOffice[0]);
            const {Name, District, State } = data[0].PostOffice[0];
            setValue("city", Name);
            setValue("district", District);
            setValue("state", State);
          } else {
            setPinError("Invalid PIN Code");
            setValue("district", "");
            setValue("state", "");
            setValue("city", "");
          }
        } catch (err) {
          setPinError("Failed to fetch location");
          setValue("district", "");
          setValue("state", "");
          setValue("city", "");
        }
        setLoadingLocation(false);
      }
    };
    fetchLocation();
  }, [pinCode]);

  const checkoutItems = cartArray.filter(item => !excludedIds.includes(item.productId));
  const totalAmount = checkoutItems.reduce((acc, item) => acc + item.salesPrice * item.qty, 0);
  const packingChargeAmount = packageCharge ? (totalAmount * (packageCharge / 100)) : 0;
  const finalAmount = totalAmount + packingChargeAmount;

  const handleRemoveFromCheckout = (id: string) => {
    setExcludedIds(prev => [...prev, id]);
  };

  const onSubmit = data => {
    setFormData(data);
    setShowDialog(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          {/* 🧾 Order Summary */}
          <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-xl p-6 relative">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-bold text-gray-800">🧾 Order Summary</h2>
              {excludedIds.length > 0 && (
                <button
                  onClick={() => setExcludedIds([])}
                  className="text-sm text-emerald-600 hover:underline transition"
                  title="Restore all removed items"
                >
                  🔄 Reload
                </button>
              )}
            </div>

            <div className="space-y-3 text-sm text-gray-600 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Subtotal</span>
                <span className="text-gray-800 font-semibold">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Packing Charges</span>
                <span className="text-gray-800 font-semibold">₹{packingChargeAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>₹{finalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 border-t pt-4 space-y-5 max-h-[400px] overflow-y-auto">
              {checkoutItems.length === 0 ? (
                <p className="text-center text-gray-500 italic">No items selected.</p>
              ) : (
                checkoutItems.map(item => (
                  <div key={item.productId} className="flex items-start gap-4 group relative">
                    <div className="w-20 h-24 bg-white rounded-xl border shadow-sm flex items-center justify-center overflow-hidden">
                      <img
                        src={item.productImageURL}
                        alt={item.productName}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 text-sm leading-tight">{item.productName}</h3>
                      <div className="text-xs mt-1">
                        <span className="text-red-400 line-through">₹{item.beforeDiscPrice?.toFixed(2)}</span>
                        <span className="ml-2 text-emerald-600 font-semibold">
                          ₹{item.salesPrice?.toFixed(2)} × {item.qty} = ₹
                          {(item.salesPrice * item.qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCheckout(item.productId)}
                      className="absolute top-1 right-1 text-red-400 hover:text-red-600 text-lg p-1 rounded-full transition"
                      title="Remove from checkout"
                    >
                      <CiTrash />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 📋 Billing Section */}
          <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Billing Details</h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <input
                  type="radio"
                  name="address"
                  checked={useExistingAddress}
                  onChange={() => {
                    setUseExistingAddress(true);
                    reset();
                  }}
                  className="accent-emerald-500"
                />
                Use existing address
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <input
                  type="radio"
                  name="address"
                  checked={!useExistingAddress}
                  onChange={() => setUseExistingAddress(false)}
                  className="accent-emerald-500"
                />
                Use new address
              </label>
            </div>

            {!useExistingAddress ? (
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="col-span-2">
                  <input
                    {...register("name", { required: "Full Name is required" })}
                    placeholder="Full Name"
                    className={`border rounded-lg p-3 w-full ${errors.name ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-emerald-400`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div className="col-span-2">
                  <input
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: "Enter a valid 10-digit Indian phone number",
                      },
                    })}
                    placeholder="Phone Number"
                    className={`border rounded-lg p-3 w-full ${errors.phone ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-emerald-400`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <div className="col-span-2">
                  <input
                    {...register("addressLine1", { required: "Address is required" })}
                    placeholder="Address Line 1"
                    className={`border rounded-lg p-3 w-full ${errors.addressLine1 ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-emerald-400`}
                  />
                  {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>}
                </div>
                 {/* PIN and City */}
                  <div className="col-span-2">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700">PIN Code*</label>
                      <input
                        type="text"
                        {...register("pinCode", {
                          required: "PIN Code is required",
                          pattern: {
                            value: /^[0-9]{6}$/,
                            message: "PIN must be 6 digits",
                          },
                        })}
                        placeholder="PIN Code"
                        className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                      {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode.message}</p>}
                      {pinError && <p className="text-red-500 text-sm">{pinError}</p>}
                      {loadingLocation && <p className="text-blue-500 text-sm">Fetching location...</p>}
                    </div>
                    {/* <select
                      {...register("city", { required: "City is required" })}
                      className={`border rounded-lg p-3 ${errors.city ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-emerald-400`}
                    >
                      <option value="">Select a City</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Bangalore">Bangalore</option>
                    </select> */}
               </div>

                {/* District and State */}
                <div className="col-span-2">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">City Name*</label>
                    <input
                      type="text"
                      {...register("city", { required: "City name is required" })}
                      readOnly
                      className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">District Name*</label>
                    <input
                      type="text"
                      {...register("district", { required: "District name is required" })}
                      readOnly
                      className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                    />
                    {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>}
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">State Name*</label>
                    <input
                      type="text"
                      {...register("state", { required: "State name is required" })}
                      readOnly
                      className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
                  </div>
                </div>
              </form>
            ) : (
              dbUser && (
                <div className="space-y-2 text-sm bg-gray-50 border p-4 rounded-lg text-gray-700">
                  <p><strong>Name:</strong> {dbUser.accounterName}</p>
                  <p><strong>Address:</strong> {dbUser.address}</p>
                  <p><strong>PIN Code:</strong> {dbUser.pinCode}</p>
                  <p><strong>Mobile:</strong> {dbUser.mobileNo}</p>
                  <p><strong>District:</strong> {dbUser.district}</p>
                  <p><strong>State:</strong> {dbUser.state}</p>
                </div>
              )
            )}

            {/* Confirm Order */}
            <div className="col-span-2 text-right mt-6">
              <button
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-lg transition duration-200 shadow-md"
                disabled={checkoutItems.length === 0 || loading}
                onClick={() => {

                  setLoading(true);

                  if (!useExistingAddress) {
                    handleSubmit(onSubmit)();
                  } else {
                    setShowDialog(true);
                  }

                  setLoading(false);

                }}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      {showDialog && (
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Order Placement</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to place this order? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  placeOrder(checkoutItems, packingChargeAmount, useExistingAddress, formData,totalAmount);
                  setShowDialog(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Yes, Place Order
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <Footer />
    </>
  );
};

export default CheckOut;
