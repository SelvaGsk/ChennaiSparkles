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
import { MdOutlinePayment } from "react-icons/md";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const CheckOut = () => {
  const { cartItems, getUser, user, placeOrder } = useFirebase();
  const cartArray = Object.values(cartItems || {});
  const [excludedIds, setExcludedIds] = useState<string[]>([]);
  const [dbUser, setdbUser] = useState();
  const [packageCharge, setdpackageCharge] = useState(0);
  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [formData, setFormData] = useState();
  const [showDialog, setShowDialog] = useState(false);
  const [ShowPayment, setShowPayment] = useState(false);
  const [isUpi, setisUpi] = useState(false);
  const [upiimage, setupiimage] = useState(null);
  const navigate = useNavigate();
 
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

  const onSubmit = (data) => {
    setFormData(data);
    // setShowDialog(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          {/* 🧾 Order Summary */}
         { !ShowPayment&&<div className="w-full md:w-1/3 h-fit bg-white rounded-2xl shadow-xl p-6 relative">
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
          </div>}

          {/* 📋 Billing Section */}
          { !ShowPayment&&user&&<div className="w-full md:w-2/3 bg-white rounded-2xl shadow-lg p-6">
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
            
            {/* proceed Payment */}
            <div className="col-span-2 text-right mt-6">
              <button
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-lg transition duration-200 shadow-md flex ml-auto items-center gap-2 cursor-pointer"
                disabled={ loading}
                onClick={async() => {
                 
                    handleSubmit(await onSubmit)();
                  if(!useExistingAddress&&(!formData.name||!formData.district||!formData.state||!formData.addressLine1||!formData.phone||!formData.city||!formData.pinCode))
                  {
                    return;
                  }
                   if(checkoutItems.length === 0)
                   {
                    toast.error("Cart is Empty!");
                    return;
                   }

                  setShowPayment(true);
                 

                }}
              ><MdOutlinePayment className="text-2xl"/>
                Proceed To Confirm
              </button>
            </div>
            {/* Confirm Order */}
            {/* <div className="col-span-2 text-right mt-6">
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
            </div> */}
          </div>}
          {/* Guest Billing Section */}
          {!user&&!ShowPayment && (
          <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-lg p-6">
            {/* 👤 Login Prompt */}
            <div className="bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">You haven’t logged in yet</h3>
              <p className="text-sm text-gray-600">
                Tracking your orders and checkout will be easier for registered users. Would you like to log in?
              </p>
              <div className="mt-4">
                <button
                  className="bg-gradient-to-r from-yellow-400 to-red-500 text-white font-medium px-5 py-2 rounded-full shadow hover:scale-105 transition-transform"
                  onClick={() => {
                    // trigger your login modal or route here
                    navigate('/login'); // or setShowLogin(true) depending on your flow
                  }}
                >
                  Login / Register
                </button>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Billing Details</h2>
          
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
            
            
            {/* proceed Payment */}
            <div className="col-span-2 text-right mt-6">
              <button
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-lg transition duration-200 shadow-md flex ml-auto items-center gap-2 cursor-pointer"
                disabled={ loading}
                onClick={() => {
                 
                    handleSubmit(onSubmit)();
                  if(!formData.name||!formData.district||!formData.state||!formData.addressLine1||!formData.phone||!formData.city||!formData.pinCode)
                  {
                    return;
                  }
                   if(checkoutItems.length === 0)
                   {
                    toast.error("Cart is Empty!");
                    return;
                   }

                  setShowPayment(true);
                 

                }}
              ><MdOutlinePayment className="text-2xl"/>
                Proceed To Confirm
              </button>
            </div>
            {/* Confirm Order */}
            {/* <div className="col-span-2 text-right mt-6">
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
            </div> */}
          </div>
)}

       {/* Billing terms and condition */}
        { ShowPayment&&<div className="w-full md:w-2/3 bg-white rounded-2xl shadow-xl p-6 relative">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
                 <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
          Booking Terms & Conditions
        </h1>

        {/* Booking Terms & Conditions */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Shipping/Transportation</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>With In Chennai Only Door Delivery Available.</li>
            <li>Out Of Chennai Districts No Door Delivery Available.</li>
            <li>Chennai Customer’s Goods Delivery On Depends On The Customer Request Date.</li>
            <li>Transportation Charges Extra</li>
            <li>Goods Cannot Be Sent Through Courier</li>
            <li>Shipping Of Goods Solely Depends On The Transporter</li>
          </ul>

          <h3 className="text-lg font-semibold mb-1">Delivery Time</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Tamilnadu - 3 Days</li>
            <li>Kerala, Andhra, Karnataka - 6 Days</li>
            <li>Rest Of India - 2 Weeks</li>
          </ul>

          <p className="text-red-600 font-bold text-lg mb-4">
            Minimum Booking Value Rs.3500
          </p>

          <h3 className="text-lg font-semibold mb-1">Modification Terms</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>
              Due To The Nature Of Fireworks Industry, The Products Are Subject To Modification
            </li>
            <li>
              If The Items You Ordered Are Not Available At The Time Of Billing/Packing, Some
              Other Product Of The Same Or More Value Will Be Sent Instead Of The Unavailable Item.
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-1">Other Terms</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>E.&O.E.</li>
            <li>Agree You Are 18 Years & Above</li>
            <li>Prices Are Inclusive Of 18% GST</li>
            <li>Subject To Sivakasi Jurisdiction</li>
          </ul>
        </section>
                </div>
            </div>
            </div>}
            {/* Payment  */}
            { ShowPayment&&
                 <PaymentDetails setShowDialog={setShowDialog} setupiimage={setupiimage} setisUpi={setisUpi} />
           }
        </div>
      </div>
       
      {/* Confirm Dialog */}
      {showDialog && (
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogContent  className="max-h-150 overflow-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-emerald-600 text-3xl text-center font-bold">Confirm Order Placement</AlertDialogTitle>
              <AlertDialogDescription>
               
                <p className="font-bold">Are you sure you want to place this order? This action cannot be undone.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  console.log(isUpi);
                  if(isUpi)
                  {  console.log(upiimage);
                    if(!upiimage){
                    toast.error("Please Uplode Upi Sceenshot");
                    return;}
                  }
                  placeOrder(checkoutItems, packingChargeAmount, useExistingAddress, formData,totalAmount,isUpi,upiimage);
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
const PaymentDetails = ({ setShowDialog,setupiimage,setisUpi }) => {
  const [selectedMethod, setSelectedMethod] = useState('netbanking');
  const [image, setImage] = useState(null);
  const {  orderloading,}=useFirebase();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) setImage(file);
    setupiimage(file);
  };

 

  return (
    <div className="max-w-md mx-auto h-fit mt-10 p-6 bg-white rounded-xl shadow-md space-y-6">
      <div className="flex items-center space-x-2">
        <MdOutlinePayment className="text-3xl bg-gradient-to-r from-orange-400 to-red-500 text-transparent bg-clip-text" />
        <h1 className="text-2xl font-bold text-gray-800">Payment Details</h1>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Choose Payment Method:</p>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md ${selectedMethod === 'netbanking' ? 'bg-black text-white' : 'bg-white border'}`}
            onClick={() => {setSelectedMethod('netbanking')
              setisUpi(false);
            }}
          >
            Net Banking
          </button>
          <button
            className={`px-4 py-2 rounded-md ${selectedMethod === 'upi' ? 'bg-black text-white' : 'bg-white border'}`}
            onClick={() => {setSelectedMethod('upi')
              setisUpi(true);
            }}
          >
            UPI
          </button>
        </div>
      </div>

      {selectedMethod === 'netbanking' && (
        <div className="bg-blue-50 p-4 rounded-md space-y-1 text-sm text-gray-700">
          <p><span className="font-bold">Bank:</span> HDFC BANK</p>
          <p><span className="font-bold">Account Holder:</span> SPARKLE ENTERPRISE</p>
          <p><span className="font-bold">Account No.:</span> 50200033706405</p>
          <p><span className="font-bold">IFSC:</span> HDFC0000010</p>
          <p><span className="font-bold">Branch:</span> BESANT NAGAR</p>
        </div>
      )}

      {selectedMethod === 'upi' && (
        <div className="flex justify-center items-center gap-6 mt-4 flex-wrap">
          <img
            src="/upi1.png"
            alt="UPI QR Code 1"
            className="w-40 h-40 object-contain rounded shadow"
          />
          <img
            src="/upi2.png"
            alt="UPI QR Code 2"
            className="w-40 h-40 object-contain rounded shadow"
          />
        </div>
      
      )}
     
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Payment Screenshot:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
      {/* Notification Label */}
      <div className="text-center text-lg font-semibold text-gray-700 mb-4">
        <span className="text-emerald-500">Note:</span> You can proceed without completing the payment.
      </div>
      <button
        className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-medium py-2 rounded-md flex items-center justify-center gap-2"
        onClick={()=>{setShowDialog(true)}} disabled={orderloading}
      >
       {orderloading? `loading`: `✅ Complete Booking`}
      </button>
    </div>
  );
};

