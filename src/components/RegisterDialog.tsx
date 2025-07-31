// @ts-nocheck
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useFirebase } from "@/Services/context";
import { useEffect, useState } from "react";

const RegisterDialog = ({settoggle,toggle}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm();

  const { GsignUp, user, loading, dbuser } = useFirebase();

  const pinCode = watch("pinCode");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [pinError, setPinError] = useState("");

  // Pre-fill form fields if dbuser exists
  useEffect(() => {
    if (dbuser) {
      setValue("firstName", dbuser.accounterName || "");
      setValue("phone", dbuser.mobileNo || "");
    //   setValue("email", user?.email || "");
      setValue("address", dbuser.address || "");
      setValue("pinCode", dbuser.pinCode || "");
      setValue("district", dbuser.district || "");
      setValue("state", dbuser.state || "");
      setValue("referredBy", dbuser.refer || "");
    }
  }, [dbuser, user, setValue]);

  const onSubmit = async (data) => {
    await GsignUp(data);
    settoggle(!toggle);
  };

  // Fetch district & state from PIN
  useEffect(() => {
    const fetchLocation = async () => {
      if (pinCode?.length === 6) {
        setLoadingLocation(true);
        setPinError("");
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`);
          const data = await res.json();
          if (data[0].Status === "Success") {
            const { District, State } = data[0].PostOffice[0];
            setValue("district", District);
            setValue("state", State);
          } else {
            setPinError("Invalid PIN Code");
            setValue("district", "");
            setValue("state", "");
          }
        } catch (err) {
          setPinError("Failed to fetch location");
          setValue("district", "");
          setValue("state", "");
        }
        setLoadingLocation(false);
      }
    };
    fetchLocation();
  }, [pinCode]);

  return (
    <div className="w-full h-[600px] overflow-auto md:min-h-0 flex justify-center items-center px-4 py-8 bg-white">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-2 md:gap-4 ">

        {/* Row 1: First Name & Phone */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">First Name*</label>
            <input
              type="text"
              placeholder="Enter Your First Name"
              {...register("firstName", { required: "First name is required" })}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Phone Number*</label>
            <input
              type="text"
              placeholder="Enter Your Phone Number"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit phone number"
                }
              })}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium">Email*</label>
          <input
            type="email"
            {...register("email")}
            readOnly
            value={user?.email}
            className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-700"
          />
        </div>

        {/* Address */}
        <div>
          <label className="text-sm font-medium">Address*</label>
          <input
            type="text"
            placeholder="Address"
            {...register("address", { required: "Address is required" })}
            className="w-full border border-gray-300 rounded-md p-2"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>

        {/* PIN Code */}
        <div>
          <label className="text-sm font-medium">PIN Code*</label>
          <input
            type="text"
            placeholder="PIN Code"
            {...register("pinCode", {
              required: "PIN is required",
              pattern: {
                value: /^[0-9]{6}$/,
                message: "PIN must be 6 digits"
              }
            })}
            className="w-full border border-gray-300 rounded-md p-2"
          />
          {errors.pinCode && <p className="text-red-500 text-sm">{errors.pinCode.message}</p>}
          {pinError && <p className="text-red-500 text-sm">{pinError}</p>}
          {loadingLocation && <p className="text-sm text-blue-500">Fetching location...</p>}
        </div>

        {/* District & State */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">District Name*</label>
            <input
              type="text"
              {...register("district", { required: "District name is required" })}
              readOnly
              className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-700"
            />
            {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">State Name*</label>
            <input
              type="text"
              {...register("state", { required: "State name is required" })}
              readOnly
              className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-700"
            />
            {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
          </div>
        </div>

        {/* Referred by */}
        <div>
          <label className="text-sm font-medium">Referred by</label>
          <input
            type="text"
            placeholder="Referred by"
            {...register("referredBy")}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <Button type="submit" className="bg-gradient-to-r from-yellow-400 to-red-500 text-white px-6 py-2 rounded hover:bg-green-400" disabled={loading}>
            {loading ? (
              <div className="animate-spin">
                <img src="/loader2.svg" className="w-3 h-3" />
              </div>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterDialog;
