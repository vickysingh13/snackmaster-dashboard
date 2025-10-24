import mongoose from "mongoose";

const DEFAULT_OPTIONS = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4 // prefer IPv4
};

export async function connectDB(uri = process.env.MONGO_URI) {
  if (process.env.SKIP_DB_CONNECT === "true") {
    console.warn("⚠️  SKIP_DB_CONNECT=true — skipping MongoDB connection (dev only).");
    return null;
  }

  if (!uri) {
    const msg = "MONGO_URI not set. Set MONGO_URI in server/.env or environment.";
    console.error("❌", msg);
    throw new Error(msg);
  }

  const maxRetries = Number(process.env.DB_CONNECT_MAX_RETRIES || 5);
  const baseDelay = Number(process.env.DB_CONNECT_BASE_DELAY_MS || 2000);
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      attempt++;
      await mongoose.connect(uri, DEFAULT_OPTIONS);
      console.log("✅ MongoDB connected");
      return mongoose;
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt} failed: ${err.message}`);
      if (attempt > maxRetries) {
        console.error("❌ Exceeded max MongoDB connection attempts.");
        throw err;
      }
      const waitMs = baseDelay * attempt;
      console.log(`⏳ Retrying in ${waitMs}ms...`);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
}
