import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const authString = req.headers.authorization;
  if (!authString || !authString.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }

  try {
    const token = authString.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      status: "error",
      message: "Token validation failed",
      error: err.message,
    });
  }
};
