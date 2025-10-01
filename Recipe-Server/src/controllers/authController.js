import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import {sendEmail} from "../utils/sendEmail.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        status: "error",
        message: "User already exists",
      });
    }
    const newUser = await User.create({ name, email, password });
    const token = generateToken({ id: newUser._id });
    res.status(201).json({
      status: "success",
      message: "Registration Successful",
      token,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
      stack: err.stack,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }
    const token = generateToken({ id: user._id });
    res.status(200).json({
      status: "success",
      message: "Login Successful",
      token,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      status: "error",
      message: "Email is required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 15;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendEmail(
      user.email,
      "Reset your password",
      `Click the link to reset your password: <a href="${resetLink}">${resetLink}</a>`
    );

    res.status(200).json({
      status: "success",
      message: "Reset link sent to email",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({
      status: "error",
      message: "New password is required",
    });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired token",
      });
    }

    user.password = newPassword; 
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successful",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};
