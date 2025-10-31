import jwt from "jsonwebtoken";
import config from "../config/index.js";

/**
 * protect - verify JWT and attach user info to req.user
 */
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }
    const decoded = jwt.verify(token, config.JWT_SECRET);
    // decoded should contain at least id and role
    req.user = { id: decoded.id, role: decoded.role || "user" };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

/**
 * authorize - allow only users with one of the provided roles
 * usage: authorize('admin') or authorize('admin','operator')
 */
export const authorize = (...allowedRoles) => (req, res, next) => {
  const userRole = req.user?.role;
  if (!userRole || !allowedRoles.includes(userRole)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  return next();
};

export default { protect, authorize };