import React, { useState } from "react";
import { useRegisterMutation } from "../slices/apiSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../slices/authSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [register, { isLoading }] = useRegisterMutation();
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
    const { name, email, password } = formData; 

    try {
      const res = await register({ name, email, password }).unwrap();

      dispatch(setUser({ token: res.token }));
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration failed: ", err);
      alert(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto flex flex-col justify-center items-center px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Create Account
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-300 shadow-gray-600 shadow-md rounded-lg p-4 sm:p-6 space-y-6"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-500 rounded px-3 py-2 text-sm sm:text-base"
        />

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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded text-sm sm:text-base"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
