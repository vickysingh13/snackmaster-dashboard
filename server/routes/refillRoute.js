import express from "express";
import { body } from "express-validator";
import asyncHandler from "../middleware/asyncHandler.js";
import validateRequest from "../middleware/validateRequest.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import refillController from "../controllers/refillController.js";

const router = express.Router();

const createRefillValidators = [
  body("productId").isMongoId().withMessage("productId is required and must be a MongoId"),
  body("machineId").isMongoId().withMessage("machineId is required and must be a MongoId"),
  body("quantityAdded").isInt({ min: 1 }).withMessage("quantityAdded must be an integer >= 1"),
  body("refilledBy").isString().trim().notEmpty().withMessage("refilledBy is required"),
];

router.post(
  "/",
  protect,
  authorize("admin", "operator"),
  createRefillValidators,
  validateRequest,
  asyncHandler(refillController.createRefill)
);

// List endpoint (optional)
router.get("/", protect, authorize("admin", "operator", "viewer"), asyncHandler(async (req, res) => {
  // simple listing
  const logs = await (await import("../models/RefillLog.js")).default.find({}).lean();
  res.json(logs);
}));

export default router;
