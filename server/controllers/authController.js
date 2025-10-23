import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (user) => {
  const payload = { id: user._id.toString(), role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET || "dev_jwt_secret", { expiresIn: "7d" });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email & password required" });

    const existingCount = await User.countDocuments();

    // If there are existing users, only an admin can register new users
    if (existingCount > 0) {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_jwt_secret");
        const adminUser = await User.findById(decoded.id);
        if (!adminUser || adminUser.role !== "admin") return res.status(403).json({ message: "Forbidden" });
      } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const u = await User.create({ name, email, password: hashed, role: role || "refiller" });
    const token = signToken(u);
    return res.status(201).json({
      token,
      user: { id: u._id, name: u.name, email: u.email, role: u.role }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email & password required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};