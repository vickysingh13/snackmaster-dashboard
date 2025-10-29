import mongoose from "mongoose";
import config from "./index.js";
import { info, warn, error as logError } from "../utils/logger.js";

const DEFAULT_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

export async function connectDB(retries = DEFAULT_RETRIES) {
  const uri = config.MONGO_URI;
  if (!uri) {
    const msg = "MONGO_URI not set. Set MONGO_URI in server/.env or environment.";
    if (config.NODE_ENV === "test") {
      warn("⚠️", msg, "Skipping connect in test environment.");
      return;
    }
    throw new Error(msg);
  }

  mongoose.set("strictQuery", false);

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(uri);
      info("MongoDB connected");
      return;
    } catch (err) {
      const attemptMsg = `MongoDB connect attempt ${attempt + 1} failed: ${err.message}`;
      logError(attemptMsg);
      if (attempt === retries) throw err;
      info(`Retrying in ${RETRY_DELAY_MS}ms...`);
      // pause before retry
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    }
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
