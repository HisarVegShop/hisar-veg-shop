// routes/category.js
import express from "express";
import Category from "../models/Category.js";
import { imagesUpload } from "../middleware/upload.js";
import path from "path";
const router = express.Router();
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Create category with image
router.post("/", imagesUpload.single("img"), async (req, res) => {
  try {
    const { name } = req.body;
    const imgPath = req.file
      ? `/uploads/images/${req.file.filename}`
      : null;

    const category = new Category({ name, img: imgPath });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all categories
router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// Update category
// PATCH /api/categories/:id
router.patch("/:id", imagesUpload.single("img"), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // If a file was uploaded, add its path to the update
    if (req.file) {
      updates.img = `/uploads/images/${req.file.filename}`;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (error) {
    console.error("PATCH category error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete category
router.delete("/:id", async (req, res) => {
  try {
      const existingCategory = await Category.findById(req.params.id);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
     if (existingCategory.img) {
        const oldPath = path.join(__dirname, "../..", existingCategory.img);
        fs.unlink(oldPath, (err) => {
          if (err) console.error("Failed to delete old image:", err);
        });
      }
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
