import MealPlan from "../models/MealPlan.js";
import User from "../models/User.js";


export const createMealPlan = async (req, res) => {
  const { weekStart, days, shoppingList, notes } = req.body;

  try {
    if (!weekStart || !Array.isArray(days) || days.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
      });
    }

    const mealPlan = await MealPlan.create({
      user: req.user._id,
      weekStart,
      days,
      shoppingList: shoppingList || [],
      notes: notes || "",
    });

    try {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { mealPlan: mealPlan._id },
      });
    } catch (userUpdateErr) {
      console.error("User update failed:", userUpdateErr);
      await User.findByIdAndUpdate(req.user._id, {
        $set: { mealPlan: [mealPlan._id] },
      });
    }

    res.status(201).json({
      status: "success",
      message: "Meal plan created successfully",
      mealPlan,
    });
  } catch (err) {
    console.error("Meal plan creation error:", err);
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};


export const getMealPlanById = async (req, res) => {
  try {
    const plan = await MealPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        status: "error",
        message: "Meal plan not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Meal plan found",
      plan,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};


export const updateMealPlan = async (req, res) => {
  const { weekStart, days, shoppingList, notes } = req.body;
  try {
    const mealPlan = await MealPlan.findByIdAndUpdate(
      req.params.id,
      { weekStart, days, shoppingList, notes },
      { new: true }
    );
    if (!mealPlan) {
      return res.status(404).json({
        status: "error",
        message: "Meal plan not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Meal plan updated successfully",
      mealPlan,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

export const deleteMealPlan = async (req, res) => {
  try {
    const deleted = await MealPlan.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Meal plan not found",
      });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { mealPlan: req.params.id },
    });

    res.status(200).json({
      status: "success",
      message: "Meal plan deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};