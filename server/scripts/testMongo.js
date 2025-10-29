import "dotenv/config";
import mongoose from "mongoose";

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MONGO_URI not set. Add it to server/.env or export it in the environment.");
  process.exit(2);
}

async function test() {
  try {
    console.log("Testing MongoDB connection...");
    // optional: use DB name from env if provided
    await mongoose.connect(uri, { dbName: process.env.MONGO_DBNAME || undefined });
    console.log("MongoDB connection OK");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("MongoDB connection FAILED:", err.message);
    process.exit(3);
  }
}

test();