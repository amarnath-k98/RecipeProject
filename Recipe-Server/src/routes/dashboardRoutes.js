import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  followUser,
  getSavedRecipes,
  toggleLikeRecipe,
  toggleSaveRecipe,
  unfollowUser,
} from "../controllers/dashboardController.js";

const dashboardRouter = Router();

dashboardRouter.post("/follow/:targetId", protect, followUser);
dashboardRouter.post("/unfollow/:targetId", protect, unfollowUser);
dashboardRouter.post("/like/:recipeId", protect, toggleLikeRecipe);
dashboardRouter.post("/save/:recipeId", protect, toggleSaveRecipe);
dashboardRouter.get("/saved", protect, getSavedRecipes);

export default dashboardRouter;
