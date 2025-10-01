import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createComment, deleteComment, getCommentsByRecipe } from "../controllers/commentController.js";



const commentRouter = Router();

commentRouter.get("/:recipeId", protect, getCommentsByRecipe);
commentRouter.post("/", protect, createComment);
commentRouter.delete("/:commentId", protect, deleteComment);

export default commentRouter;