import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import authRouter from "./src/routes/authRoutes.js";
import profileRouter from "./src/routes/profileRoutes.js";
import dashboardRouter from "./src/routes/dashboardRoutes.js";
import mealPlanRouter from "./src/routes/mealPlanRoutes.js";
import commentRouter from "./src/routes/commentRoutes.js";
import recipeRouter from "./src/routes/recipeRoutes.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/social", dashboardRouter);
app.use("/api/mealplan", mealPlanRouter);
app.use("/api/comments", commentRouter);
app.use("/api/recipes", recipeRouter);

app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
