import { model, Schema } from "mongoose";


const shoppingListSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        ingredient: {
            type: String,
            required: true
        },
        quantity: {
            type: String,
            trim: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
        
}, { timestamps: true });

const ShoppingList = model("ShoppingList", shoppingListSchema);
export default ShoppingList;