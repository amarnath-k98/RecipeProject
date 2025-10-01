import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="text-center min-h-screen py-20 px-4">
    <h1 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-4">
      404 – Page Not Found
    </h1>
    <p className="text-sm sm:text-base text-gray-500 mb-6">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to="/" className="text-blue-600 hover:underline text-sm sm:text-base">
      Go back to Home
    </Link>
  </div>
);

export default NotFound;
