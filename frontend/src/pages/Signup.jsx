import { useForm } from "react-hook-form";
import { useState } from "react"; 
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
   const navigate = useNavigate(); // ✅


  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/signup`,
        data,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("✅ Registration successful!");
        reset(); // Clear form
      navigate('/'); // ✅ Redirect to your protected/dashboard page

      } else {
        alert(response.data.message || "❌ Registration failed.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      if (error.response?.data?.message) {
        alert(`❌ ${error.response.data.message}`);
      } else {
        alert("❌ Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/india.jpg')] bg-cover bg-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Sign Up
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-green-800 mb-1">Name</label>
          <input
            {...register("name", { required: true })}
            className="w-full border border-green-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">Name is required</p>
          )}
        </div>

        {/* Age */}
        <div className="mb-4">
          <label className="block text-green-800 mb-1">Age</label>
          <input
            type="number"
            {...register("age", { required: true })}
            className="w-full border border-green-300 rounded px-3 py-2"
            placeholder="Enter your age"
          />
          {errors.age && (
            <p className="text-red-500 text-sm">Age is required</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-green-800 mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full border border-green-300 rounded px-3 py-2"
            placeholder="example@example.com"
          />
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <label className="block text-green-800 mb-1">Mobile</label>
          <input
            type="tel"
            {...register("mobile")}
            className="w-full border border-green-300 rounded px-3 py-2"
            placeholder="1234567890"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-green-800 mb-1">Address</label>
          <input
            {...register("address", { required: true })}
            className="w-full border border-green-300 rounded px-3 py-2"
            placeholder="Enter your address"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">Address is required</p>
          )}
        </div>

       {/* Aadhar Card */}
<div className="mb-4">
  <label className="block text-green-800 mb-1">
    Aadhar Card Number
  </label>
  <input
    type="text"
    maxLength={12}
    {...register("aadharCardNumber", {
      required: "12 digit Aadhar Card Number is required",
      pattern: {
        value: /^\d{12}$/,
        message: "Aadhar must be exactly 12 digits",
      },
    })}
    className="w-full border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
    placeholder="123456789012"
  />
  {errors.aadharCardNumber && (
    <p className="text-red-500 text-sm mt-1">
      {errors.aadharCardNumber.message}
    </p>
  )}
</div>


        {/* Password */}
     {/* Password */}
<div className="mb-4 relative">
  <label className="block text-green-800 mb-1">Password</label>
  <input
    type={showPassword ? "text" : "password"}
    {...register("password", { required: true })}
    className="w-full border border-green-300 rounded px-3 py-2 pr-10"
    placeholder="Enter a secure password"
  />
  
  {/* Toggle visibility icon */}
  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
    tabIndex={-1}
  >
    {showPassword ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.487.323-2.9.9-4.175M6.218 6.218A10.004 10.004 0 0112 5c5.523 0 10 4.477 10 10a9.966 9.966 0 01-1.028 4.372M3 3l18 18" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )}
  </button>

  {errors.password && (
    <p className="text-red-500 text-sm">Password is required</p>
  )}
</div>


        {/* Role */}
        <div className="mb-6">
          <label className="block text-green-800 mb-1">Role</label>
          <select
            {...register("role")}
            className="w-full border border-green-300 rounded px-3 py-2"
          >
            <option value="voter">Voter</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Signup;
