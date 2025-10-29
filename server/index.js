import config from "./config/index.js";
// dotenv is loaded by config/index.js
import express from "express";
import cors from "cors";
import { connectDB, disconnectDB } from "./config/db.js"; // named exports
import { info, warn, error as logError } from "./utils/logger.js";
import mongoose from "mongoose";

// Routes (existing imports)
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

// Health endpoint (checks DB and app)
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection?.readyState || 0; // 1 = connected
  res.json({
    ok: dbState === 1,
    db: { readyState: dbState },
    env: { nodeEnv: config.NODE_ENV },
  });
});

// Optional root endpoint
app.get("/", (req, res) => res.send("Hello World from Backend!"));

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
let server;

export const start = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => info(`Server running on port ${PORT}`));
    return server;
  } catch (err) {
    logError("MongoDB connection error:", err);
    if (config.NODE_ENV === "test") throw err;
    process.exit(1);
  }
};

// Graceful shutdown
export const shutdown = async (signal) => {
  info(`\nReceived ${signal}. Closing server...`);
  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      info("HTTP server closed.");
    }
    await disconnectDB();
    info("Shutdown complete.");
  } catch (err) {
    logError("Error during shutdown:", err);
  } finally {
    process.exit(0);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// start only in non-test env to avoid interfering with tests
if (config.NODE_ENV !== "test") {
  start();
}

// export app for tests
export default app;