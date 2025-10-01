import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../slices/apiSlice";

const ResetPassword = () => {
  const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await resetPassword({ token, newPassword }).unwrap();
      setMessage(res.message);
      setNewPassword("");
        setConfirmPassword("");
        navigate("/login");
    } catch (err) {
      setMessage(err.data?.message || "Reset failed");
    }
  };


    return (
      <div className=" flex justify-center items-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-md mx-auto p-6 bg-gray-400 rounded-md shadow-lg shadow-gray-600">
          <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          {message && <p className="mt-4 text-gray-600">{message}</p>}
        </div>
      </div>
    );
};

export default ResetPassword;
