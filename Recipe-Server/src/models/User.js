import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: [3, "Name must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    bio: {
      type: String,
      maxLength: 200,
    },
    avatar: {
      type: String,
      default: "https://yourdomain.com/default-avatar.png",
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    shoppingList: [
      {
        type: Schema.Types.ObjectId,
        ref: "ShoppingList",
      },
    ],
    recipes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    savedRecipes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    likedRecipes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    following: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    mealPlan: {
      type: [Schema.Types.ObjectId],
      ref: "MealPlan",
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function (userPassword) {
  try {
    return await bcrypt.compare(userPassword, this.password);
  } catch (err) {
    console.error(err);
    return false;
  }
};

const User = model("User", userSchema);
export default User;
