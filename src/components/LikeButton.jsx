import React from "react";
import { useLikeRecipeMutation } from "../slices/apiSlice";

const LikeButton = ({ recipeId, isLiked }) => {
  const [likeRecipe, { isLoading }] = useLikeRecipeMutation();

  const handleClick = async () => {
    try {
      await likeRecipe(recipeId).unwrap();
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`px-3 py-1 rounded text-sm sm:text-base font-medium transition-colors ${
        isLiked
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {isLoading ? "..." : isLiked ? "Liked ❤️" : "Like"}
    </button>
  );
};

export default LikeButton;
