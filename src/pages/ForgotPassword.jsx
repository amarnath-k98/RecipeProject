import React, { useState } from "react";
import { useForgotPasswordMutation } from "../slices/apiSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email }).unwrap();
      setMessage(res.message);
    } catch (err) {
      setMessage(err.data?.message || "Something went wrong");
    }
  };

    return (
      <div className=" px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-md mx-auto p-6 bg-gray-400 rounded-md shadow-lg shadow-gray-600">
          <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
      </div>
    );
};

export default ForgotPassword;
