import React from "react";
import { Link } from "react-router-dom";

const RecipeCard = ({ recipe, readOnly = false }) => {


  return (
    <div className="bg-gray-400 rounded-lg shadow-lg shadow-gray-600 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {readOnly ? (
        <img
          src={recipe.image || "/Recipe_image.jpg"}
          alt={recipe.title}
          className="w-full h-48 object-cover sm:h-56 md:h-64"
        />
      ) : (
        <Link to={`/recipes/${recipe._id}`}>
          <img
            src={recipe.image || "/Recipe_image.jpg"}
            alt={recipe.title}
            className="w-full h-48 object-cover sm:h-56 md:h-64"
          />
        </Link>
      )}

      <div className="p-4 sm:p-5">
        {readOnly ? (
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
            {recipe.title}
          </h3>
        ) : (
          <Link to={`/recipes/${recipe._id}`}>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
              {recipe.title}
            </h3>
          </Link>
        )}

        <p className="text-sm sm:text-base text-gray-700 mt-1">
          {recipe.cookingTime} mins • {recipe.servings} servings
        </p>

        <div className="mt-2 flex flex-wrap gap-2 text-xs sm:text-sm text-gray-100">
          {Array.isArray(recipe.ingredients) &&
            recipe.ingredients.map((ing, idx) => (
              <span key={idx} className="bg-gray-600  px-2 py-1 rounded">
                {ing}
              </span>
            ))}
          {Array.isArray(recipe.ingredients) &&
            recipe.ingredients.length > 3 && (
              <span className="text-gray-400">
                +{recipe.ingredients.length - 3} more
              </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
