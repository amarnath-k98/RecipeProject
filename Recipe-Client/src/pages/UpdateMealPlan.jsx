import React, { useState, useEffect } from "react";
import {
  useGetMealPlanByIdQuery,
  useUpdateMealPlanMutation,
  useGetRecipesQuery,
  useGetUserDashboardQuery,
} from "../slices/apiSlice";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import RecipeCard from "../components/RecipeCard";

const UpdateMealPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: planData, isLoading, isError } = useGetMealPlanByIdQuery(id);
  const { data: recipeData } = useGetRecipesQuery({ page: 1, limit: 20 });
  const [updateMealPlan, { isLoading: isUpdating }] =
    useUpdateMealPlanMutation();
  const { refetch } = useGetUserDashboardQuery();

  const [weekStart, setWeekStart] = useState("");
  const [selectedRecipes, setSelectedRecipes] = useState([]);



  const plan = planData?.plan;

  useEffect(() => {
    if (plan) {
      setWeekStart(plan.weekStart.slice(0, 10));
      const mealIds = plan.days?.[0]?.meals || [];
      setSelectedRecipes(mealIds.map(String));
    }
  }, [plan]);

  const toggleRecipe = (recipeId) => {
    setSelectedRecipes((prev) =>
      prev.includes(recipeId)
        ? prev.filter((r) => r !== recipeId)
        : [...prev, recipeId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMealPlan({
        id,
        weekStart,
        days: [
          {
            date: weekStart,
            meals: selectedRecipes,
          },
        ],
      }).unwrap();
      refetch();
      navigate("/dashboard");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (isLoading) return <Loading message="Loading meal plan..." />;
  if (isError || !plan)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load meal plan.
      </div>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-screen-xl mx-auto bg-gray-300 rounded-md shadow-lg shadow-gray-600 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Update Meal Plan
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
              className="w-full border border-gray-600 rounded px-3 py-2 text-sm sm:text-base"
            />
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Select Recipes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipeData?.recipes.map((recipe) => {
                const isSelected = selectedRecipes.includes(recipe._id);
                return (
                  <div
                    key={recipe._id}
                    className={`relative border rounded-lg p-2 cursor-pointer ${
                      isSelected
                        ? "border-gray-500 ring-2 ring-gray-300"
                        : "border-gray-300"
                    }`}
                    onClick={() => toggleRecipe(recipe._id)}
                  >
                    <RecipeCard recipe={recipe} readOnly />
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-gray-600 text-white text-xs px-2 py-1 rounded shadow">
                        Selected
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded text-sm sm:text-base"
          >
            {isUpdating ? "Updating..." : "Update Meal Plan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateMealPlan;
