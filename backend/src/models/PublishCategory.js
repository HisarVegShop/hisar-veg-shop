// models/PublishCategory.js
import mongoose from "mongoose";

const publishCategorySchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, unique: true },
    img: { type: String },
  },
  { timestamps: true }
);

const PublishCategory = mongoose.model(
  "PublishCategory",
  publishCategorySchema
);
export default PublishCategory;
