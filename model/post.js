import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    content: { type: String, required: true },
    creator: { type: ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Posts", postSchema);
