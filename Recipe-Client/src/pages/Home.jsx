import React, { useState, useEffect } from "react";
import {
  useGetRecipesQuery
} from "../slices/apiSlice";
import RecipeCard from "../components/RecipeCard";
import Loading from "../components/Loading";

const Home = () => {
  const { data: recipeData, isLoading: loadingRecipes } = useGetRecipesQuery({
    page: 1,
    limit: 20,
  });

  const recipes = recipeData?.recipes || [];


  const [viewMode, setViewMode] = useState("home");

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

 useEffect(() => {
   if (!Array.isArray(recipes)) return;

   const lowerSearch = searchTerm.toLowerCase();
   const filtered = recipes.filter((recipe) =>
     recipe.title.toLowerCase().includes(lowerSearch)
   );

   setFilteredRecipes(filtered);
 }, [searchTerm, recipeData]);


  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
      {viewMode === "home" && (
        <>
          <section>
            <h2 className="text-2xl  font-bold mb-4">Latest Recipes</h2>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-96 px-4 py-2 border border-gray-500 rounded-md shadow-sm shadow-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {loadingRecipes ? (
              <Loading message="Loading recipes..." />
            ) : filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <p>No recipes found.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
