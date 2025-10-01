import { Router } from "express";
import { deleteAccount, getAllUser, getProfile, getUserDashboard, updateProfile } from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";


const profileRouter = Router();


profileRouter.put("/update", protect, updateProfile);
profileRouter.get("/", protect, getProfile);
profileRouter.get("/dashboard", protect, getUserDashboard);
profileRouter.get("/all", protect, getAllUser);
profileRouter.delete("/delete", protect, deleteAccount);


export default profileRouter;