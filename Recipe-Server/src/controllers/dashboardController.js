import Recipe from "../models/Recipe.js";
import User from "../models/User.js";

export const followUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.targetId;

    if (!targetUserId || currentUserId.toString() === targetUserId.toString()) {
      return res.status(400).json({
        status: "error",
        message: "Invalid follow target",
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        status: "error",
        message: "Target user not found",
      });
    }

    if (!Array.isArray(currentUser.following)) currentUser.following = [];
    if (!Array.isArray(targetUser.followers)) targetUser.followers = [];

    if (currentUser.following.includes(targetUserId)) {
      return res.status(400).json({
        status: "error",
        message: "Already following this user",
      });
    }

    await User.findByIdAndUpdate(
      currentUserId,
      {
        $addToSet: { following: targetUserId },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: currentUserId },
    });

    res.status(200).json({
      status: "success",
      message: "Followed user successfully",
    });
  } catch (err) {
    console.error("Follow error:", err);
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.targetId;

    if (currentUserId.toString() === targetUserId) {
      return res.status(400).json({
        status: "error",
        message: "You can't unfollow yourself",
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        status: "error",
        message: "Target user not found",
      });
    }

    if (!Array.isArray(currentUser.following)) currentUser.following = [];
    if (!currentUser.following.includes(targetUserId)) {
      return res.status(400).json({
        status: "error",
        message: "You are not following this user",
      });
    }

    await User.findByIdAndUpdate(
      currentUserId,
      {
        $pull: { following: targetUserId },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUserId },
    });

    res.status(200).json({
      status: "success",
      message: "Unfollowed successfully",
    });
  } catch (err) {
    console.error("Unfollow error:", err);
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

export const toggleLikeRecipe = async (req, res) => {
  const { recipeId } = req.params;
  const user = await User.findById(req.user.id);
  const recipe = await Recipe.findById(recipeId);

  if (!user || !recipe) {
    return res.status(404).json({ message: "User or recipe not found" });
  }

  if (!Array.isArray(recipe.likes)) recipe.likes = [];
  if (!Array.isArray(user.likedRecipes)) user.likedRecipes = [];

  const alreadyLiked = recipe.likes.includes(req.user.id);

  if (alreadyLiked) {
    recipe.likes.pull(req.user.id);
    user.likedRecipes.pull(recipeId);
  } else {
    recipe.likes.push(req.user.id);
    user.likedRecipes.push(recipeId);
  }

  await recipe.save();
  await user.save();

  res.status(200).json({
    status: "success",
    message: alreadyLiked ? "Unliked the recipe" : "Liked the recipe",
    isLiked: !alreadyLiked,
  });
};

export const toggleSaveRecipe = async (req, res) => {
  const { recipeId } = req.params;
  const user = await User.findById(req.user.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  if (!Array.isArray(user.savedRecipes)) user.savedRecipes = [];

  const alreadySaved = user.savedRecipes.includes(recipeId);

  if (alreadySaved) {
    user.savedRecipes.pull(recipeId);
  } else {
    user.savedRecipes.push(recipeId);
  }

  await user.save();

  res.status(200).json({
    status: "success",
    message: alreadySaved ? "Unsaved the recipe" : "Saved the recipe",
    isSaved: !alreadySaved,
  });
};

export const getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedRecipes",
      populate: { path: "author", select: "name avatar" },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Saved recipes fetched successfully",
      recipes: user.savedRecipes,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};
