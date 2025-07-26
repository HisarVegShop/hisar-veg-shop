import express from "express";
import Product from "../models/Product.js";
import { imagesUpload } from "../middleware/upload.js";
import qs from "qs";
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Price:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - stock
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         know_name:
 *           type: array
 *           items:
 *             type: string
 *         price:
 *           $ref: '#/components/schemas/Price'
 *         stock:
 *           type: number
 *         img:
 *           type: string
 *         description:
 *           type: string
 *         categories:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("categories");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categories"
    );
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               img:
 *                 type: string
 *                 format: binary
 *               data:
 *                 type: string
 *                 description: JSON string of product data
 *     responses:
 *       201:
 *         description: Product created
 */
router.post("/", imagesUpload.single("img"), async (req, res) => {
  try {
    const data = qs.parse(req.body); // parses nested fields
    // console.log(parsedBody);
    // const data = JSON.parse(req.body);

    const imgPath = req.file
      ? `/uploads/images/${req.file.filename}`
      : undefined;

    const product = new Product({
      ...data,
      img: imgPath || data.img,
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update a product by ID
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               img:
 *                 type: string
 *                 format: binary
 *               data:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
router.patch("/:id", imagesUpload.single("img"), async (req, res) => {
  try {
    const data = req.body;
    const imgPath = req.file
      ? `/uploads/images/${req.file.filename}`
      : undefined;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { ...data, ...(imgPath && { img: imgPath }) },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
