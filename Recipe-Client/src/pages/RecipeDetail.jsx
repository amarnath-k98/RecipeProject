import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useCreateCommentMutation,
  useGetCommentsQuery,
  useGetRecipeByIdQuery,
  useDeleteRecipeMutation,
  useRateRecipeMutation,
  useGetRecipeRatingQuery,
} from "../slices/apiSlice";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";
import CommentList from "../components/CommentList";
import CommentBox from "../components/CommentBox";
import RecipeActions from "../components/RecipeActions";
import Recipe_image from "../assets/Recipe_image.jpg";

const RecipeDetail = () => {
  const { id: recipeId } = useParams();
  const navigate = useNavigate();

  const {
    data: recipeData,
    isLoading,
    isError,
  } = useGetRecipeByIdQuery(recipeId);
  const recipe = recipeData?.recipe;

  const { data: commentsData, refetch: refetchComments } =
    useGetCommentsQuery(recipeId);
  const comments = commentsData?.comments || [];

  const { data: ratingData, refetch: refetchRating } =
    useGetRecipeRatingQuery(recipeId);
  const [rateRecipe] = useRateRecipeMutation();

  const [createComment] = useCreateCommentMutation();
  const [deleteRecipe, { isLoading: deleting }] = useDeleteRecipeMutation();

  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(0);

  const currentUserId = useSelector((state) => state.auth.user?._id);
  const isOwner = recipe?.author?._id === currentUserId;

  useEffect(() => {
    if (ratingData?.rating) {
      setRating(ratingData.rating);
    }
  }, [ratingData]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await createComment({ recipeId, text: commentText }).unwrap();
      refetchComments();
      setCommentText("");
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  const handleRate = async (star) => {
    try {
      await rateRecipe({ recipeId, rating: star }).unwrap();
      setRating(star);
      refetchRating();
    } catch (err) {
      console.error("Rating failed:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await deleteRecipe(recipe._id).unwrap();
      alert("Recipe deleted successfully.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete recipe.");
    }
  };

  const handleEdit = () => {
    navigate(`/recipes/edit/${recipe._id}`);
  };

  const getEmbedURL = (url) => {
    if (!url) return null;

    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/
    );

    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  if (isLoading) return <Loading message="Loading recipe..." />;
  if (isError || !recipe)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load recipe.
      </div>
    );

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">{recipe.title}</h1>

      <img
        src={recipe.image || Recipe_image}
        alt={recipe.title}
        className="w-full h-64 object-contain rounded mb-6"
      />

      <div className="flex flex-col gap-4 mb-6">
        <RecipeActions
          recipeId={recipe._id}
          isLiked={recipe.isLiked}
          isSaved={recipe.isSaved}
          onRate={handleRate}
          rating={rating}
        />

        {isOwner && (
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleEdit}
              disabled={!isOwner}
              className={`px-3 py-1 rounded text-sm ${
                isOwner
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed"
              }`}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={!isOwner || deleting}
              className={`px-3 py-1 rounded text-sm ${
                isOwner
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Ingredients</h2>
          <ul className="list-disc list-inside text-sm sm:text-base space-y-1">
            {recipe.ingredients?.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Details</h2>
          <p className="text-sm sm:text-base">
            Cooking Time: {recipe.cookingTime} mins
          </p>
          <p className="text-sm sm:text-base">Servings: {recipe.servings}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Preparation Steps</h2>
        <p className="text-sm sm:text-base whitespace-pre-line">
          {Array.isArray(recipe.steps) ? recipe.steps.join("\n") : recipe.steps}
        </p>
      </div>

      {recipe.videoUrl && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Video Tutorial</h2>
          <div className="aspect-video">
            <iframe
              src={`${getEmbedURL(recipe.videoUrl)}?modestbranding=1&rel=0`}
              title="Recipe Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded"
            ></iframe>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Comments</h2>
        <CommentList comments={comments} />
        <CommentBox
          value={commentText}
          onChange={setCommentText}
          onSubmit={handleCommentSubmit}
        />
      </div>
    </div>
  );
};

export default RecipeDetail;
