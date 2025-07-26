import mongoose from "mongoose";
const priceSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  know_name: [String],
  price: [priceSchema],
  stock: { type: Number, default: 0 },
  img: String,
  description: String,
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

export default mongoose.model("Product", productSchema);
