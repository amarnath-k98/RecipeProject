import { model, Schema } from "mongoose";


const mealPlanSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weekStart: {
      type: Date,
      required: true,
    },
    days: {
      type: [
        {
          date: {
            type: Date,
            required: true,
          },
          meals: [
            {
              type: Schema.Types.ObjectId,
              ref: "Recipe",
            },
          ],
        },
      ],
      validate: {
        validator: function (days) {
          const uniqueDays = new Set(days.map((d) => d.date.toISOString()));
          return uniqueDays.size === days.length;
        },
        message: "Duplicate days are not allowed in the meal plans.",
      },
    },
    shoppingList: [
      {
        ingredient: {
          type: String,
          required: true,
        },
        quantity: {
          type: String,
          trim: true,
        },
      },
    ],
    notes: {
      type: String,
      trim: true,
      maxLength: 500,
    },
  },
  { timestamps: true }
);


const MealPlan = model("MealPlan", mealPlanSchema);
export default MealPlan;