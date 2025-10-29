import { MongoMemoryServer } from "mongodb-memory-server";
import { connectDB } from "../config/db.js";

export default async function globalSetup() {
  const mongod = await MongoMemoryServer.create({ instance: { dbName: "jest" } });
  process.env.MONGO_URI = mongod.getUri();
  global.__MONGOD__ = mongod;
  // connectDB reads process.env.MONGO_URI via config/index.js
  await connectDB();
}