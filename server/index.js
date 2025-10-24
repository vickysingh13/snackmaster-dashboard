import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js"; // named export

// Routes
import testRoutes from "./routes/testRoute.js";
import productRoutes from "./routes/productRoute.js";
import vendingMachineRoutes from "./routes/vendingMachineRoute.js";
import refillRoutes from "./routes/refillRoute.js";
import authRoutes from "./routes/authRoute.js";

// Error middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes early so they exist if tests import app
app.use("/api/test", testRoutes);
app.use("/api/products", productRoutes);
app.use("/api/machines", vendingMachineRoutes);
app.use("/api/refills", refillRoutes);
app.use("/api/auth", authRoutes);

// Optional root endpoint
app.get("/", (req, res) => res.send("Hello World from Backend!"));

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
let server;

const start = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n⚠️  Received ${signal}. Closing server...`);
  if (server) {
    server.close(() => {
      console.log("HTTP server closed.");
      import("mongoose").then(({ default: mongoose }) => {
        mongoose.connection.close(false, () => {
          console.log("MongoDB connection closed.");
          process.exit(0);
        });
      });
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// start after setup
start();

// export for tests
export default app;