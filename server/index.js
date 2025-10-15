// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// Routes
import testRoutes from "./routes/testRoute.js";
import productRoutes from "./routes/productRoute.js"; // <-- import product routes

// Error middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/test", testRoutes);
app.use("/api/products", productRoutes); // <-- mount product routes

// Optional root endpoint
app.get("/", (req, res) => res.send("Hello World from Backend!"));

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
