import { model, Schema } from "mongoose";

const recipeSchema = Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minLength: [3, "Title must be at least 3 characters"],
    },
    ingredients: [
      {
        type: String,
        trim: true,
        required: [true, "Ingredients are required"],
      },
    ],
    steps: [
      {
        type: String,
        required: [true, "Instructions are required"],
        trim: true,
      },
    ],
    image: {
      type: String,
    },
    cookingTime: {
      type: Number,
    },
    servings: {
      type: Number,
    },
    videoUrl: {
      type: String,
      validate: {
        validator: function (v) {
          return (
            !v || // allow empty
            /^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.+$/.test(
              v
            )
          );
        },
        message: "Video must be a valid YouTube or Vimeo URL",
      },
    },
    dietaryTags: [
      {
        type: String,
        enum: [
          "Vegetarian",
          "Vegan",
          "Gluten-Free",
          "Dairy-Free",
          "Keto",
          "Pescatarian",
          "None",
        ],
      },
    ],
    ratings: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true },
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);


recipeSchema.index({ title: "text", ingredients: "text", tags: "text" });

recipeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

recipeSchema.virtual("averageRating").get(function () {
  if (!this.ratings.length) return 0;
  const total = this.ratings.reduce((sum, r) => sum + r.score, 0);
  return (total / this.ratings.length).toFixed(1);
});

const Recipe = model("Recipe", recipeSchema);
export default Recipe;
