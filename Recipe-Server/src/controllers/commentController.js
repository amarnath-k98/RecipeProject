import Comment from "../models/Comment.js";

export const createComment = async (req, res) => {
  const { recipeId, text } = req.body;
  try {
    const comment = await Comment.create({
      user: req.user._id,
      recipe: recipeId,
      text,
    });
    res.status(201).json({
      status: "success",
      comment,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

export const getCommentsByRecipe = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const comments = await Comment.find({ recipe: recipeId }).populate(
      "user",
      "name avatar"
    );
    res.status(200).json({
      status: "success",
      comments,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findByIdAndDelete(commentId);
    res.status(200).json({
      status: "success",
      message: "Comment deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};
