import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "change-me";
const JWT_EXPIRES = "7d";

// =======================
// REGISTER
// =======================
export const register = async (req, res, next) => {
  try {
    const { name, email: rawEmail, password, role: requestedRole } = req.body;
    const email = String(rawEmail || "").trim().toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    // Ensure we only use roles allowed by the schema; default to first enum value (or 'user' fallback)
    const allowedRoles = (User.schema.path("role") && User.schema.path("role").enumValues) || [];
    const normalizedRequestedRole = String(requestedRole || "").trim();
    const role = normalizedRequestedRole && allowedRoles.includes(normalizedRequestedRole)
      ? normalizedRequestedRole
      : (allowedRoles.length ? allowedRoles[0] : "user");

    // Check for existing email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    console.error("auth.register error:", err);
    return next(err);
  }
};

// =======================
// LOGIN
// =======================
export const login = async (req, res, next) => {
  try {
    const { email: rawEmail, password } = req.body;
    const email = String(rawEmail || "").trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("auth.login error:", err);
    if (typeof next === "function") return next(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export default { register, login };
