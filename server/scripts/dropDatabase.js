import "dotenv/config";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../config/db.js";
import { info, error as logError } from "../utils/logger.js";

async function drop() {
  try {
    if (!process.env.MONGO_URI) {
      logError("MONGO_URI not set in server/.env");
      process.exit(2);
    }
    await connectDB();
    // drops the current database defined in the URI (or use name)
    const dbName = mongoose.connection.db.databaseName;
    info("Dropping database:", dbName);
    await mongoose.connection.db.dropDatabase();
    info("Dropped database:", dbName);
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    logError("Drop failed:", err);
    try { await disconnectDB(); } catch {}
    process.exit(1);
  }
}

drop();