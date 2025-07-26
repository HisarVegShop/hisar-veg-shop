// routes/publishFull.js
import express from "express";
const router = express.Router();
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import PublishCategory from "../models/PublishCategory.js";
import PublishProduct from "../models/PublishProduct.js";

// Publish everything
router.post("/all", async (req, res) => {
  try {
    // Clear old publish collections
    await PublishCategory.deleteMany({});
    await PublishProduct.deleteMany({});

    // Copy categories
    const categories = await Category.find({});
    const publishedCategories = await PublishCategory.insertMany(categories);

    // Map old category IDs to published ones
    const catMap = new Map();
    categories.forEach((cat) => {
      catMap.set(cat._id.toString(), cat._id); // IDs stay same since we preserve _id
    });

    // Copy products
    const products = await Product.find({});
    const publishedProducts = products.map((p) => {
      return {
        ...p.toObject(),
        categories: p.categories.map((catId) => catMap.get(catId.toString())),
      };
    });

    await PublishProduct.insertMany(publishedProducts);

    res.json({ message: "Published all products and categories successfully." });
  } catch (err) {
    console.error("Publish error:", err);
    res.status(500).json({ error: "Publishing failed." });
  }
});

export default router;
