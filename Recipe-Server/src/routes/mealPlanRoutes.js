import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createMealPlan,
  deleteMealPlan,
  getMealPlanById,
  updateMealPlan,
} from "../controllers/mealPlanController.js";


const mealPlanRouter = Router();

mealPlanRouter.post("/", protect, createMealPlan);
mealPlanRouter.get("/:id", protect, getMealPlanById);
mealPlanRouter.put("/:id", protect, updateMealPlan);
mealPlanRouter.delete("/:id", protect, deleteMealPlan);

export default mealPlanRouter;