import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../slices/authSlice";

const NavBar = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login");
  };

  return (
    <nav className="bg-gray-300  shadow-md px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
        Recipe Hub
      </div>

      <div className="flex flex-wrap justify-center sm:justify-end gap-4 text-sm sm:text-base">
        <Link to="/" className="text-black hover:text-blue-600">
          Home
        </Link>

        {token && (
          <>
            <Link to="/users" className="text-black hover:text-blue-600">
              Users
            </Link>
            <Link to="/dashboard" className="text-black hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="/recipes/new" className="text-black hover:text-blue-600">
              Create Recipe
            </Link>
            <Link
              to="/mealplan/create"
              className="text-black hover:text-blue-600"
            >
              Meal Plan
            </Link>
            <Link to="/saved" className="text-black hover:text-blue-600">
              Saved
            </Link>
            <Link to="/profile" className="text-black hover:text-blue-600">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </>
        )}
        {!token && (
          <>
            <Link to="/login" className="text-black hover:text-blue-600">
              Login
            </Link>
            <Link to="/register" className="text-black hover:text-blue-600">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
