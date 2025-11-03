import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

// Use existing User model if present, otherwise define a minimal one
let User;
try {
  User = mongoose.model("User");
} catch (e) {
  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  }, { timestamps: true });

  // remove password before returning JSON
  userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
  };

  User = mongoose.models.User || mongoose.model("User", userSchema);
}

// Helper: sign token
function signToken(payload) {
  const secret = process.env.JWT_SECRET || "test-secret";
  const expiresIn = "7d";
  return jwt.sign(payload, secret, { expiresIn });
}

// Register endpoint used by tests
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    return res.status(201).json(user);
  } catch (err) {
    // keep responses simple for tests
    return res.status(500).json({ message: err.message || "server error" });
  }
});

// Login endpoint used by tests
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "invalid credentials" });

    const token = signToken({ id: user._id, email: user.email });
    return res.status(200).json({ token, user: user.toJSON() });
  } catch (err) {
    return res.status(500).json({ message: err.message || "server error" });
  }
});

export default app;