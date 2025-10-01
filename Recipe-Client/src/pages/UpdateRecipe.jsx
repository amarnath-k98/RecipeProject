import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetRecipeByIdQuery,
  useGetUserDashboardQuery,
  useUpdateRecipeMutation,
} from "../slices/apiSlice";
import Loading from "../components/Loading";
import VideoUpload from "../components/VideoUpload";

const UpdateRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: recipe, isLoading, isError } = useGetRecipeByIdQuery(id);
  const [updateRecipe, { isLoading: isUpdating }] = useUpdateRecipeMutation();
  const { refetch } = useGetUserDashboardQuery();


  const [formData, setFormData] = useState({
    title: "",
    image: "",
    ingredients: "",
    steps: "",
    cookingTime: "",
    servings: "",
    videoURL: "",
  });

  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title || "",
        image: recipe.image || "",
        ingredients: recipe.ingredients?.join("\n") || "",
        steps: recipe.steps || "",
        cookingTime: recipe.cookingTime || "",
        servings: recipe.servings || "",
        videoURL: recipe.videoURL || "",
      });
    }
  }, [recipe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {};
    Object.keys(formData).forEach((key) => {
      const original =
        key === "ingredients"
          ? recipe.ingredients?.join("\n") || ""
          : recipe[key] || "";

      if (formData[key] !== original) {
        payload[key] =
          key === "ingredients"
            ? formData.ingredients
                .split("\n")
                .map((i) => i.trim())
                .filter(Boolean)
            : formData[key];
      }
    });
    try {
      await updateRecipe({ id, ...payload }).unwrap();
      console.log("Updated recipe:", recipe);
      refetch();
      navigate(`/recipes/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (isLoading) return <Loading message="Loading recipe..." />;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load recipe.
      </div>
    );

  return (
    <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Update Recipe
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gray-300 shadow-lg shadow-gray-600 rounded-lg p-4 sm:p-6"
      >
        <div>
          <label className="block text-sm sm:text-base font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-500 rounded px-3 py-2 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm sm:text-base font-medium mb-1">
            Image URL
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full border border-gray-500 rounded px-3 py-2 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm sm:text-base font-medium mb-1">
            Ingredients (one per line)
          </label>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-500 rounded px-3 py-2 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm sm:text-base font-medium mb-1">
            Preparation Steps
          </label>
          <textarea
            name="steps"
            value={formData.steps}
            onChange={handleChange}
            rows="6"
            className="w-full border border-gray-500 rounded px-3 py-2 text-sm sm:text-base whitespace-pre-line"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm sm:text-base font-medium mb-1">
              Cooking Time (mins)
            </label>
            <input
              type="number"
              name="cookingTime"
              value={formData.cookingTime}
              onChange={handleChange}
              className="w-full border border-gray-500 rounded px-3 py-2 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium mb-1">
              Servings
            </label>
            <input
              type="number"
              name="servings"
              value={formData.servings}
              onChange={handleChange}
              className="w-full border border-gray-500 rounded px-3 py-2 text-sm sm:text-base"
            />
          </div>
        </div>

        <VideoUpload
          value={formData.videoURL}
          onChange={(url) =>
            setFormData((prev) => ({ ...prev, videoURL: url }))
          }
        />

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded text-sm sm:text-base"
        >
          {isUpdating ? "Updating..." : "Update Recipe"}
        </button>
      </form>
    </div>
  );
};

export default UpdateRecipe;
