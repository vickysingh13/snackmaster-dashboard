import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "change-me";
const JWT_EXPIRES = "7d";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // allow first user to self-register as admin, otherwise only admin can create users
    const usersCount = await User.countDocuments();
    if (usersCount > 0) {
      // if there are users, require requester to be admin
      const authHeader = req.headers.authorization?.split(" ")[1];
      if (!authHeader) return res.status(403).json({ message: "Only admin can register new users" });
      try {
        const payload = jwt.verify(authHeader, JWT_SECRET);
        if (payload.role !== "admin") return res.status(403).json({ message: "Only admin can register new users" });
      } catch {
        return res.status(403).json({ message: "Only admin can register new users" });
      }
    }

    if (await User.findOne({ email })) return res.status(409).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("auth.register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("auth.login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};