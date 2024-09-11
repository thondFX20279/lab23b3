import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, default: "I am a new" },
    posts: [{ type: ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
