import "dotenv/config";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../config/db.js";

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MONGO_URI not set. Add it to server/.env or export it in the environment.");
  process.exit(2);
}

async function test() {
  try {
    await connectDB();
    console.log("MongoDB connection OK");
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error("MongoDB connection FAILED:", err.message || err);
    process.exit(1);
  }
}

test();