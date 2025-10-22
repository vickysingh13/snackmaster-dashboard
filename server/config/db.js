import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI is not set. Add MONGO_URI to server/.env or export it in your shell.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri); // simplified
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Stop server if DB connection fails
  }
};

export default connectDB;
