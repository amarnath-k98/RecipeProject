import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetMealPlanByIdQuery,
  useGetRecipesQuery,
  useDeleteMealPlanMutation,
} from "../slices/apiSlice";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";
import RecipeCard from "../components/RecipeCard";

const MealPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: planData, isLoading, isError } = useGetMealPlanByIdQuery(id);
  const {
    data: recipeData,
    isLoading: loadingRecipes,
    isError: errorRecipes,
  } = useGetRecipesQuery({ page: 1, limit: 100 });

  const [deleteMealPlan, { isLoading: deleting }] = useDeleteMealPlanMutation();
  const currentUserId = useSelector((state) => state.auth.user?._id);

  const plan = planData?.plan;
  const isOwner =
    plan?.user === currentUserId || plan?.user?._id === currentUserId;

 const selectedRecipes = (() => {
   if (!Array.isArray(plan?.days) || !Array.isArray(recipeData?.recipes))
     return [];

   const mealIds = plan.days[0]?.meals?.map(String) || [];

   const selected = recipeData.recipes.filter((r) =>
     mealIds.includes(String(r._id))
   );

   if (selected.length === 0) {
     console.warn("No matching recipes found for meal IDs:", mealIds);
   }

   return selected;
 })();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this meal plan?"))
      return;
    try {
      await deleteMealPlan({ id: plan._id }).unwrap();
      navigate("/dashboard");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete meal plan.");
    }
  };

  const handleUpdate = () => {
    navigate(`/mealplan/update/${plan._id}`);
  };

  if (isLoading || loadingRecipes)
    return <Loading message="Loading meal plan..." />;
  if (isError || !plan)
    return (
      <div className="text-center py-10 text-red-500">
        Meal plan not found or has been deleted.
      </div>
    );

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6  space-y-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Meal Plan for {new Date(plan.weekStart).toLocaleDateString()}
      </h1>

      {selectedRecipes.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          No recipes found for this meal plan.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedRecipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} readOnly />
          ))}
        </div>
      )}

      {isOwner && (
        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={handleUpdate}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm sm:text-base"
          >
            Update Plan
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm sm:text-base"
          >
            {deleting ? "Deleting..." : "Delete Plan"}
          </button>
        </div>
      )}
    </div>
  );
};

export default MealPlanDetail;
