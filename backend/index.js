// index.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
const app = express();
app.use(cors());
import productRoutes from "./src/routes/product.js";
import categoryRoutes from "./src/routes/category.js";
import swaggerSpec from "./src/swagger.js";
import swaggerUi from "swagger-ui-express";
import publishFullRoutes from "./src/routes/publishFull.js";
import publishRoutes from "./src/routes/publish.js";
import orderRoutes from "./src/routes/order.js";
import authRoutes from "./src/routes/auth.js";
app.use(express.json());
// Swagger UI route
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/uploads/products", express.static("uploads"));
app.use("/uploads/categories", express.static("uploads"));

app.use("/api/publish", publishFullRoutes);
app.use("/api/publish", publishRoutes);
app.use("/api/auth", authRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
