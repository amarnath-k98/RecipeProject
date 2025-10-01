import React, { useEffect, useState } from "react";
import {
  useToggleLikeMutation,
  useSaveRecipeMutation,
} from "../slices/apiSlice";
import ShareButton from "./ShareButton";
import RatingStars from "./RatingStars";

const RecipeActions = ({
  recipeId,
  isLiked: initialLiked,
  isSaved: initialSaved,
  onRate,
  rating,
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isSaved, setIsSaved] = useState(initialSaved);

  const [toggleLike, { isLoading: liking }] = useToggleLikeMutation();
  const [saveRecipe, { isLoading: saving }] = useSaveRecipeMutation();

  useEffect(() => {
    setIsLiked(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    setIsSaved(initialSaved);
  }, [initialSaved]);

  const handleLike = async () => {
    try {
      const res = await toggleLike({ recipeId }).unwrap();
      setIsLiked(res?.isLiked ?? true);
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleSave = async () => {
    try {
      const res = await saveRecipe({ recipeId }).unwrap();
      setIsSaved(res?.isSaved ?? true);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <div className="flex gap-4 mt-4 flex-wrap">
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={handleLike}
          disabled={liking}
          aria-label="Like this recipe"
          className={`px-4 py-2 rounded text-sm sm:text-base font-medium ${
            isLiked ? "bg-gray-500 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          {liking ? "Liking..." : isLiked ? "Liked ❤️" : "Like 🤍"}
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          aria-label="Save this recipe"
          className={`px-4 py-2 rounded text-sm sm:text-base font-medium ${
            isSaved ? "bg-gray-500 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          {saving ? "Saving..." : isSaved ? "Saved ✅" : "Save 💾"}
        </button>

        <ShareButton recipeId={recipeId} />
      </div>

      {onRate && (
        <div className="w-full mt-2">
          <h4 className="text-sm font-medium mb-2">Rate this recipe:</h4>
          <RatingStars rating={rating} onRate={onRate} />
        </div>
      )}
    </div>
  );
};

export default RecipeActions;
