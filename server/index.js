// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js"; // named export

// Routes
import testRoutes from "./routes/testRoute.js";
import productRoutes from "./routes/productRoute.js";
import vendingMachineRoutes from "./routes/vendingMachineRoute.js";
import refillRoutes from "./routes/refillRoute.js";
import authRoutes from "./routes/authRoute.js";

// Error middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

(async () => {
  try {
    if (typeof connectDB !== "function") {
      console.error("❌ connectDB import is not a function. Check server/config/db.js export.");
      process.exit(1);
    }
    await connectDB();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1);
  }
})();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
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
const server = app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n⚠️  Received ${signal}. Closing server...`);
  server.close(() => {
    console.log("HTTP server closed.");
    // close mongoose connection
    import("mongoose").then(({ default: mongoose }) => {
      mongoose.connection.close(false, () => {
        console.log("MongoDB connection closed.");
        process.exit(0);
      });
    });
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// export for tests
export default app;
