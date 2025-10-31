import mongoose from "mongoose";

export default async function globalTeardown() {
  try {
    if (mongoose.connection?.readyState === 1) {
      await mongoose.connection.dropDatabase();
    }
  } catch (e) { /* ignore */ }

  try {
    await mongoose.disconnect();
  } catch (e) { /* ignore */ }

  if (global.__MONGOD__) {
    await global.__MONGOD__.stop();
  }
}