import React, { useEffect } from "react";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CreateRecipe from "./pages/CreateRecipe";
import RecipeDetail from "./pages/RecipeDetail";
import SavedRecipes from "./pages/SavedRecipes";
import CreateMealPlan from "./pages/CreateMealPlan";
import UpdateMealPlan from "./pages/UpdateMealPlan";
import MealPlanDetail from "./pages/MealPlanDetail";
import ProfileEdit from "./pages/ProfileEdit";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import UpdateRecipe from "./pages/UpdateRecipe";
import { useDispatch } from "react-redux";
import {  loadUserFromToken } from "./slices/authSlice";
import UsersPage from "./pages/UsersPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);


  return (
    <div className="bg-emerald-200 min-h-screen">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recipes/new"
          element={
            <ProtectedRoute>
              <CreateRecipe />
            </ProtectedRoute>
          }
        />

        <Route path="/recipes/:id" element={<RecipeDetail />} />

        <Route
          path="/recipes/edit/:id"
          element={
            <ProtectedRoute>
              <UpdateRecipe />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedRecipes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mealplan/create"
          element={
            <ProtectedRoute>
              <CreateMealPlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mealplan/:id"
          element={
            <ProtectedRoute>
              <MealPlanDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mealplan/update/:id"
          element={
            <ProtectedRoute>
              <UpdateMealPlan />
            </ProtectedRoute>
          }
        />

        <Route path="/mealplan/:id" element={<MealPlanDetail />} />

        <Route
          path="/profile/"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <ProfileEdit />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
