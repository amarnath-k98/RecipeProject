import { model, Schema } from "mongoose";


const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recipe: {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxLength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });


const Comment = model("Comment", commentSchema);
export default Comment;