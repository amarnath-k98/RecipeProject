import React, { useState } from "react";
import { useLoginMutation } from "../slices/apiSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../slices/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData).unwrap();
      dispatch(setUser(res));
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed: ", err);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto flex flex-col justify-center items-center  px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Login
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-gray-300 shadow-gray-600 shadow-md rounded-lg p-4 sm:p-6 space-y-6"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-500 rounded px-3 py-2 text-sm sm:text-base"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-500 rounded px-3 py-2 text-sm sm:text-base"
          />

          <div className="text-right mt-2">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded text-sm sm:text-base"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
