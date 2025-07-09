import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/profile/password`, {
        identifier, // Could be aadharCardNumber or email, depending on your backend
      });

      if (res.status === 200) {
        setSubmitted(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending reset link. Try again.');
      setError('This functionality currently not avelable!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5">
        <h2 className="text-2xl font-bold text-center text-green-700">Forgot Password</h2>

        {submitted ? (
          <p className="text-green-700 text-center">
            ✅ If an account exists, a reset link or OTP has been sent to your registered contact.
          </p>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter Aadhar or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
            >
              Send Reset Link
            </button>

            <div className="text-center">
              <a href="/" className="text-sm text-green-600 hover:underline">
                Back to Login
              </a>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
