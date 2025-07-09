import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, data, { withCredentials: true });

      if (res.status === 200 && res.data.token && res.data.user?.role) {
        const { token, user } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role); // Save role

        alert('✅ Login successful!');

        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'voter') {
          navigate('/voterdasbord');
        } else {
          alert('❌ Unknown role received.');
        }
      } else {
        alert("❌ Login failed: Incomplete response.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.status === 401) {
        alert("❌ Invalid credentials.");
      } else {
        alert("❌ Server error. Please try again.");
      }
    }
  };

  return (
   <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
  {/* Background Layer with Blur */}
  <div className="absolute inset-0 bg-[url('/ind.jpg')] bg-cover bg-center blur-sm z-0"></div>

  {/* Foreground Login Form */}
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="relative z-10 bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5"
  >
    <h2 className="text-2xl font-bold text-center text-green-700">Login</h2>

    <input
      {...register("aadharCardNumber", { required: true })}
      placeholder="Aadhar Card Number"
      type="number"
      className="w-full p-2 border rounded"
    />
    {errors.aadharCardNumber && (
      <p className="text-red-600 text-sm">Aadhar is required</p>
    )}

    <div className="relative">
      <input
        {...register("password", { required: true })}
        placeholder="Password"
        type={showPassword ? "text" : "password"}
        className="w-full p-2 border rounded pr-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-green-600 hover:underline"
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>
    {errors.password && (
      <p className="text-red-600 text-sm">Password is required</p>
    )}

    <div className="text-right">
      <a href="/forgotpassword" className="text-sm text-green-600 hover:underline">
        Forgot Password?
      </a>
    </div>

    <button
      type="submit"
      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
    >
      Login
    </button>

    <p className="text-sm text-center">
      Don't have an account?{" "}
      <a href="/signup" className="text-green-700 font-semibold underline">
        Sign up
      </a>
    </p>
  </form>
</div>

  );
};

export default Login;
