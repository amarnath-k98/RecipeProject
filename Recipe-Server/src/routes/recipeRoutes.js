import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createRecipe, deleteRecipe, getAllRecipes, getRecipeById,  getRecipeRating,  rateRecipe,  searchRecipes,  updateRecipe } from "../controllers/recipeController.js";


const recipeRouter = Router();

recipeRouter.post("/", protect, createRecipe);
recipeRouter.get("/search", protect, searchRecipes);
recipeRouter.get("/", protect, getAllRecipes);
recipeRouter.get("/:id", protect, getRecipeById);
recipeRouter.patch("/:id", protect, updateRecipe);
recipeRouter.delete("/:id", protect, deleteRecipe);
recipeRouter.post("/:id/rate", protect, rateRecipe);
recipeRouter.get("/:id/rating", getRecipeRating);


export default recipeRouter;