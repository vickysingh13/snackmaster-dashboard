import express from "express";
import { getRefills, createRefill } from "../controllers/refillController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// protect create refill: only refiller or admin
router.post("/", protect, authorize("admin", "refiller"), createRefill);

// allow reading refills for admin/refiller/viewer
router.get("/", protect, authorize("admin", "refiller", "viewer"), getRefills);

export default router;
