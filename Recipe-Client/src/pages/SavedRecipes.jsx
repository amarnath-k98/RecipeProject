import React from "react";
import { useGetSavedRecipesQuery } from "../slices/apiSlice";
import Loading from "../components/Loading";
import RecipeCard from "../components/RecipeCard";

const SavedRecipes = () => {
  const { data, isLoading, isError } = useGetSavedRecipesQuery();

  const savedRecipes = data?.recipes || [];

  if (isLoading) return <Loading message="Loading saved recipes..." />;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load saved recipes.
      </div>
    );

  return (
    <div className="max-w-screen-xl min-h-screen  mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Your Saved Recipes
      </h1>

      {savedRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedRecipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          You haven’t saved any recipes yet.
        </p>
      )}
    </div>
  );
};

export default SavedRecipes;
