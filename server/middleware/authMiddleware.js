import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "change-me";

export const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return res.status(401).json({ message: "Not authorized" });
  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "Not authorized" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  next();
};