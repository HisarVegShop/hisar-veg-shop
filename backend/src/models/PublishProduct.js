// models/PublishProduct.js
import mongoose from "mongoose";

const publishProductSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    know_name: [String],
    description: String,
    stock: Number,
    img: String,
    price: [
      {
        name: String,
        price: Number,
      },
    ],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "PublishCategory" }],
  },
  { timestamps: true }
);

const PublishProduct = mongoose.model("PublishProduct", publishProductSchema);
export default PublishProduct;
