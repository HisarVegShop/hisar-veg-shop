import express from "express";
const router = express.Router();

import PublishCategory from "../models/PublishCategory.js";
import PublishProduct from "../models/PublishProduct.js";

// ✅ Get all published categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await PublishCategory.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch published categories" });
  }
});

// ✅ Get all published products
router.get("/products", async (req, res) => {
  try {
    const products = await PublishProduct.find({}).populate("categories");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch published products" });
  }
});

// ✅ Get single published product by ID
router.get("/products/:id", async (req, res) => {
  try {
    const product = await PublishProduct.findById(req.params.id).populate("categories");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

export default router;
