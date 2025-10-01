import Recipe from "../models/Recipe.js";
import User from "../models/User.js";

function convertToEmbedURL(url) {
  if (!url) return "";

  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return url;
}

export const createRecipe = async (req, res) => {
  try {
    req.body.videoUrl = convertToEmbedURL(req.body.videoUrl);
    const recipe = await Recipe.create({ ...req.body, author: req.user._id });
    await User.findByIdAndUpdate(req.user._id, {
      $push: { recipes: recipe._id },
    });

    res.status(201).json({
      status: "success",
      message: "Recipe created successfully",
      recipe,
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
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json({
      status: "success",
      message: "Recipes fetched successfully",
      recipes,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "author",
      "_id name"
    );
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const userId = req.user?._id?.toString();
    const isLiked = userId ? recipe.likes.includes(userId) : false;
    const isSaved = userId
      ? (await User.findById(userId)).savedRecipes.includes(recipe._id)
      : false;

    res.status(200).json({
      status: "success",
      recipe: {
        ...recipe.toObject(),
        isLiked,
        isSaved,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.videoUrl) {
      updates.videoUrl = convertToEmbedURL(updates.videoUrl);
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res
        .status(404)
        .json({ status: "error", message: "Recipe not found" });
    }

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this recipe",
      });
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== recipe[key]) {
        recipe[key] = value;
      }
    });

    await recipe.save();

    res.status(200).json({
      status: "success",
      message: "Recipe updated successfully",
      recipe,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        status: "error",
        message: "Recipe not found",
      });
    }

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this recipe",
      });
    }

    await recipe.deleteOne();

    res.status(200).json({
      status: "success",
      message: "Recipe deleted successfully",
      recipe,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

export const searchRecipes = async (req, res) => {
  try {
    const rawQuery = req.query.query?.trim();

    if (!rawQuery) {
      return res.status(400).json({
        status: "error",
        message: "Missing search query",
      });
    }

    const tokens = rawQuery.split(" ").filter(Boolean);
    const regexArray = tokens.map((word) => ({
      $or: [
        { title: { $regex: word, $options: "i" } },
        { ingredients: { $regex: word, $options: "i" } },
        { cuisine: { $regex: word, $options: "i" } },
      ],
    }));

    const recipes = await Recipe.find({ $and: regexArray });

    res.status(200).json({
      status: "success",
      message: "Recipes fetched successfully",
      recipes,
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

export const rateRecipe = async (req, res) => {
  try {
    const { rating } = req.body;
    const userId = req.user._id;
    const recipeId = req.params.id;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({
        status: "error",
        message: "Recipe not found",
      });
    }

    const existingRating = recipe.ratings.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
    } else {
      recipe.ratings.push({ user: userId, rating });
    }

    await recipe.save();

    res.status(200).json({
      status: "success",
      message: "Rating submitted successfully",
      rating,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

export const getRecipeRating = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        status: "error",
        message: "Recipe not found",
      });
    }

    const ratings = recipe.ratings || [];
    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    const average = ratings.length ? total / ratings.length : 0;

    res.status(200).json({
      status: "success",
      rating: Math.round(average),
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};
