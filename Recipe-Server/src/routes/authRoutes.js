import { Router } from "express";
import { forgotPassword, login, register, resetPassword } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);


export default authRouter;