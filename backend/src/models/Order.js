import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // _id is default
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    cartdetail: { type: String, required: true }, // JSON string
    totalPrice: { type: Number, required: true, default: 0 }, // Ensure totalPrice is included
    status: {
      type: Number,
      enum: [0, 1, 2, 3], // 0: create, 1: confirm, 2: reject, 3: delivered
      default: 0,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
