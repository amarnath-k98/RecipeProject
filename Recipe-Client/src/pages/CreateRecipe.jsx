import React, { useState } from "react";
import { useCreateRecipeMutation  } from "../slices/apiSlice";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";
import VideoUpload from "../components/VideoUpload";

const CreateRecipe = () => {
  const [createRecipe, { isLoading }] = useCreateRecipeMutation();


  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    ingredients: [""],
    steps: "",
    cookingTime: "",
    servings: "",
    image: "",
    videoURL: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      ingredients: formData.ingredients.filter((ing) => ing.trim() !== ""),
      steps: formData.steps
        .split(",")
        .map((step) => step.trim())
        .filter((step) => step.length > 0),
      cookingTime: Number(formData.cookingTime),
      servings: Number(formData.servings),
      ...(formData.image && { image: formData.image }),
      ...(formData.videoURL && { videoUrl: formData.videoURL }),
    };

    try {
      console.log("Submitting recipe:", payload);
      await createRecipe(payload).unwrap();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Recipe creation failed:", err);
    }
  };

  const handleIngredientChange = (idx, value) => {
    const updated = [...formData.ingredients];
    updated[idx] = value;
    setFormData((prev) => ({ ...prev, ingredients: updated }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  return (
    <>
      <div className="max-w-screen-md  mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Submit a New Recipe
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-300 shadow-gray-700 shadow-md rounded-lg p-4 sm:p-6 space-y-6"
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
              required
              className="w-full border border-gray-500 rounded px-3 py-2 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium mb-1">
              Ingredients
            </label>
            {formData.ingredients.map((ing, idx) => (
              <input
                key={idx}
                type="text"
                value={ing}
                onChange={(e) => handleIngredientChange(idx, e.target.value)}
                placeholder={`Ingredient ${idx + 1}`}
                className="w-full mb-2 border border-gray-500 rounded px-3 py-2 text-sm sm:text-base"
              />
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="text-blue-600 hover:underline text-sm sm-text-base"
            >
              + Add Ingredient
            </button>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium mb-1">
              Preparation Steps
            </label>
            <textarea
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-500 rounded px-3 py-2 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium mb-1">
              Cooking Time (mins)
            </label>
            <input
              type="number"
              name="cookingTime"
              value={formData.cookingTime}
              onChange={handleChange}
              required
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
              required
              className="w-full border border-gray-500 rounded px-3 py-2 text-sm sm:text-base"
            />
          </div>

          <ImageUpload
            value={formData.image}
            onChange={(url) =>
              setFormData((prev) => ({
                ...prev,
                image: url,
              }))
            }
          />

          <VideoUpload
            value={formData.videoURL}
            onChange={(url) =>
              setFormData((prev) => ({
                ...prev,
                videoURL: url,
              }))
            }
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-600 shadow-gray-500 shadow-md hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded text-sm sm:text-base"
          >
            {isLoading ? "Submitting..." : "Submit Recipe"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateRecipe;
