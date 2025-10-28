import mongoose from "mongoose";
import { info, warn, error as logError } from "../utils/logger.js";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    const msg = "MONGO_URI not set. Set MONGO_URI in server/.env or environment.";
    if (process.env.NODE_ENV === "test") {
      warn("⚠️", msg, "Skipping connect in test environment.");
      return;
    }
    throw new Error(msg);
  }

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(uri);
    info("MongoDB connected");
  } catch (err) {
    logError("MongoDB connection failed:", err);
    throw err;
  }
}

export async function disconnectDB() {
  try {
    if (mongoose.connection?.readyState) {
      await mongoose.disconnect();
      info("MongoDB disconnected");
    }
  } catch (err) {
    logError("Error disconnecting MongoDB:", err);
  }
}

export default mongoose;
