//@ts-nocheck
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useFirebase } from "@/Services/context";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = ({ isDialog = false }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const { signUp, user, loading } = useFirebase();

  const pinCode = watch("pinCode");
  const password = watch("password");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [pinError, setPinError] = useState("");

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  useEffect(() => {
    const fetchLocation = async () => {
      if (pinCode?.length === 6) {
        setLoadingLocation(true);
        setPinError("");
        try {
          const res = await fetch(
            `https://api.postalpincode.in/pincode/${pinCode}`
          );
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

  const onSubmit = async (data) => {
    await signUp(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8 px-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8">
        {!isDialog && (
          <div className="text-center mb-6">
            <img
              src="/logo.png"
              alt="Chennai Sparkle Crackers"
              className="mx-auto h-20"
            />
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6"
        >
          {/* Row 1 */}
          <div className="flex gap-10">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                First Name*
              </label>
              <input
                type="text"
                {...register("firstName", {
                  required: "First name is required",
                })}
                placeholder="Enter Your First Name"
                className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number*
              </label>
              <input
                type="text"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit phone number",
                  },
                })}
                placeholder="Enter Your Phone Number"
                className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex gap-10">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                Email*
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email address",
                  },
                })}
                placeholder="Enter Your Email"
                className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full relative">
            <label className="block text-sm font-medium text-gray-700">
              Password*
            </label>
            <input
              type={showPass ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              placeholder="Enter Your Password"
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10"
            />
            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-[35px] text-gray-600 cursor-pointer"
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password*
            </label>
            <input
              type={showConfirmPass ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              placeholder="Confirm Your Password"
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10"
            />
            <span
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute right-3 top-[35px] text-gray-600 cursor-pointer"
            >
              {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address*
            </label>
            <input
              type="text"
              {...register("address", { required: "Address is required" })}
              placeholder="Address"
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* PIN and City */}
          <div className="flex gap-10">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                PIN Code*
              </label>
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
              {errors.pinCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pinCode.message}
                </p>
              )}
              {pinError && <p className="text-red-500 text-sm">{pinError}</p>}
              {loadingLocation && (
                <p className="text-blue-500 text-sm">Fetching location...</p>
              )}
            </div>

            {/* <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">City Name*</label>
              <select
                {...register("city", { required: "City is required" })}
                className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select a City</option>
                <option value="Chennai">Chennai</option>
                <option value="Madurai">Madurai</option>
              </select>
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
            </div> */}
          </div>

          {/* District and State */}
          <div className="flex gap-10">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                District Name*
              </label>
              <input
                type="text"
                {...register("district", {
                  required: "District name is required",
                })}
                readOnly
                className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
              />
              {errors.district && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.district.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                State Name*
              </label>
              <input
                type="text"
                {...register("state", { required: "State name is required" })}
                readOnly
                className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>
          </div>

          {/* Referral */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Referred by
            </label>
            <input
              type="text"
              {...register("referredBy")}
              placeholder="Referred by"
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Submit */}
          <div className="mt-6 flex justify-between items-center">
            {!isDialog && (
              <Button
                type="submit"
                className="bg-green-400 cursor-pointer hover:bg-green-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin">
                    <img src="/loader2.svg" className="w-3 h-3" />
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            )}
            {isDialog && (
              <Button
                type="submit"
                className="bg-green-400 cursor-pointer hover:bg-green-300 flex items-center justify-center mx-auto"
              >
                Save
              </Button>
            )}
            {!isDialog && (
              <p className="cursor-pointer" onClick={() => navigate("/login")}>
                Have an account?
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
