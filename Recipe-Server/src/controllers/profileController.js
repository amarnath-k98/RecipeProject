import User from "../models/User.js";
import Recipe from "../models/Recipe.js";
import MealPlan from "../models/MealPlan.js";
import Comment from "../models/Comment.js";

export const updateProfile = async (req, res) => {
  const { name, bio, avatar } = req.body;
  try {
    const user = await User.findById(req.user.id);
    console.log("Incoming profile update:", req.body);
    console.log("Authenticated user:", req.user);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (name?.trim()) user.name = name;
    if (bio?.trim()) user.bio = bio;
    if (avatar?.startsWith("data:image")) user.avatar = avatar;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate({
      path: "following",
      model: "User",
      select: "name avatar bio",
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User found",
      user,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

export const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("name email bio avatar")
      .populate({
        path: "recipes",
        model: "Recipe",
        select:
          "title image rating servings cookingTime dietaryTags isPublished",
      })
      .populate({
        path: "savedRecipes",
        model: "Recipe",
        select:
          "title image rating servings cookingTime dietaryTags isPublished",
      })
      .populate({
        path: "likedRecipes",
        model: "Recipe",
        select:
          "title image rating servings cookingTime dietaryTags isPublished",
      })
      .populate({
        path: "favorites",
        model: "Recipe",
        select: "title image rating servings cookingTime dietaryTags",
      })
      .populate({
        path: "following",
        model: "User",
        select: "name avatar bio",
      })
      .populate({
        path: "followers",
        model: "User",
        select: "name avatar",
      })
      .populate({
        path: "mealPlan",
        model: "MealPlan",
        select: "weekStart days shoppingList notes",
      });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User found",
      user: {
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
      },
      recipes: user.recipes,
      mealPlans: user.mealPlan,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();

    const currentUser = await User.findById(currentUserId).select("following");
    const followingSet = new Set(
      currentUser.following.map((id) => id.toString())
    );

    const users = await User.find({ _id: { $ne: currentUserId } })
      .select("name email avatar bio createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const enrichedUsers = users.map((user) => ({
      ...user,
      isFollowing: followingSet.has(user._id.toString()),
    }));

    if (enrichedUsers.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No users found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Users found",
      users: enrichedUsers,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    await Recipe.deleteMany({ author: userId });
    await MealPlan.deleteMany({ user: userId });
    await Comment.deleteMany({ author: userId });

    await User.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );
    await User.updateMany(
      { following: userId },
      { $pull: { following: userId } }
    );

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
