import express from "express";
import PublishProduct from "../models/PublishProduct.js";
import Order from "../models/Order.js";
const router = express.Router();

// POST /api/orders/check
router.post("/check", async (req, res) => {
  try {
    const { cartItems } = req.body;
    let valid = true;
    let updatedPrices = [];

    for (const item of cartItems) {
      const dbProduct = await PublishProduct.findById(item.id);
      if (!dbProduct) {
        valid = false;
        continue;
      }
      for (const price of item.price) {
        const dbPrice = dbProduct.price.find(
          (p) => p._id.toString() === price._id
        );
        if (!dbPrice || dbPrice.price != price.price) {
          valid = false;
        }
      }
    }
    res.json({ valid, updatedPrices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/order (create order)
router.post("/", async (req, res) => {
  try {
    const { name, phone, address, cartdetail, totalPrice } = req.body.cartItems;
    // cartdetail should be a JSON string

    const order = new Order({
      name,
      phone,
      address,
      cartdetail,
      // date: date ? new Date(date) : undefined,
      totalPrice: totalPrice || 0, // Ensure totalPrice is included
    });
    await order.save();
    res.status(201).json({ status: "success", order: order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/order?date=YYYY-MM-DD
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};
    if (date) {
      // Find orders for the specific date (ignoring time)
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (typeof status !== "number") {
      return res.status(400).json({ error: "Status must be a number" });
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.post("/list", async (req, res) => {
  try {
    const { ids } = req.body; // ids should be an array of order IDs
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No order IDs provided" });
    }
    const orders = await Order.find({ _id: { $in: ids } }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;
