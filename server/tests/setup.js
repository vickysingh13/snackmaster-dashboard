import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";

let mongod;

export default async function globalSetup() {
  mongod = await MongoMemoryServer.create({ instance: { dbName: "jest" } });
  process.env.MONGO_URI = mongod.getUri();
  await connectDB();
  global.__MONGOD__ = mongod;
}

export async function globalTeardown() {
  try {
    await mongoose.disconnect();
  } catch (e) { /* ignore */ }
  if (global.__MONGOD__) {
    await global.__MONGOD__.stop();
  }
}