import { connectDB, disconnectDB } from "../config/db.js";
import Product from "../models/Product.js";

async function list() {
  try {
    await connectDB();
    const docs = await Product.find({}).lean();
    console.log(JSON.stringify(docs, null, 2));
  } catch (err) {
    console.error("Error listing products:", err.message || err);
    process.exitCode = 2;
  } finally {
    await disconnectDB();
  }
}

list();