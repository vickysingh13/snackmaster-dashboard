import "dotenv/config";

const { MONGO_URI, JWT_SECRET, NODE_ENV, PORT } = process.env;
const isProd = NODE_ENV === "production";

// Local fallback for dev/test
const DEFAULT_LOCAL = "mongodb://127.0.0.1:27017/snackmaster";
const MONGO = MONGO_URI || (!isProd ? DEFAULT_LOCAL : null);

if (!MONGO) {
  throw new Error("MONGO_URI not set. Set MONGO_URI in server/.env or environment.");
}

export default {
  MONGO_URI: MONGO,
  JWT_SECRET: JWT_SECRET || "dev_jwt_secret",
  NODE_ENV: NODE_ENV || "development",
  PORT: PORT || 5000,
  isProd,
};