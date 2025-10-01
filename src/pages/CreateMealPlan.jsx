import React, { useState } from "react";
import {
  useCreateMealPlanMutation,
  useGetRecipesQuery,
  useGetUserDashboardQuery,
} from "../slices/apiSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import RecipeCard from "../components/RecipeCard";

const CreateMealPlan = () => {
  const {
    data: recipeData,
    isLoading,
    isError,
  } = useGetRecipesQuery({ page: 1, limit: 20 });
  const [createMealPlan, { isLoading: isSubmitting }] =
    useCreateMealPlanMutation();
  const { refetch } = useGetUserDashboardQuery();

  const navigate = useNavigate();

  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [weekStart, setWeekStart] = useState("");

  const toggleRecipe = (id) => {
    setSelectedRecipes((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!weekStart || isNaN(Date.parse(weekStart))) {
      console.error("Invalid weekStart date:", weekStart);
      alert("Please select a valid date.");
      return;
    }

    const payload = {
      weekStart,
      days: [
        {
          date: weekStart,
          meals: selectedRecipes,
        },
      ],
    };

    try {
      console.log("Submitting meal plan:", payload);
      await createMealPlan(payload).unwrap();
      navigate("/dashboard");
      refetch();
    } catch (err) {
      console.error( "Meal plan creation failed:", err);
    }
  };

  if (isLoading) return <Loading message="Loading recipes..." />;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load recipes.
      </div>
    );

  return (
    <div className=" px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-screen-xl mx-auto bg-gray-300 rounded-md shadow-lg shadow-gray-600 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Create Weekly Meal Plan
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm sm:text-base font-medium mb-1">
              Week Start Date
            </label>
            <input
              type="date"
              value={weekStart}
              onChange={(e) => setWeekStart(e.target.value)}
              required
              className="w-full border border-gray-500 rounded px-3 py-2 text-sm sm:text-base"
            />
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Select Recipes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipeData?.recipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className={`border rounded-lg p-2 cursor-pointer relative ${
                    selectedRecipes.includes(recipe._id)
                      ? "border-blue-500 ring-2 ring-blue-300"
                      : "border-gray-300"
                  }`}
                  onClick={() => toggleRecipe(recipe._id)}
                >
                  <RecipeCard recipe={recipe} readOnly />
                  {selectedRecipes.includes(recipe._id) && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Selected
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white shadow-lg shadow-gray-500 font-semibold py-2 px-4 rounded text-sm sm:text-base"
          >
            {isSubmitting ? "Creating..." : "Create Meal Plan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMealPlan;
