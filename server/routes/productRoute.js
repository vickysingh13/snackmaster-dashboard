import express from "express";
import { body } from "express-validator";
import asyncHandler from "../middleware/asyncHandler.js";
import validateRequest from "../middleware/validateRequest.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import * as productController from "../controllers/productController.js";

const router = express.Router();

// Public: list and get are public for integration tests and public API
router.get(
  "/",
  asyncHandler(productController.getProducts)
); // Get all products

router.get(
  "/:id",
  asyncHandler(productController.getProductById)
); // Get product by ID

// Protected: only authenticated & authorized users can create products
router.post(
  "/",
  protect,
  authorize("admin", "operator"),
  [
    body("name").isString().notEmpty().withMessage("name is required"),
    body("price").isNumeric().withMessage("price must be a number"),
  ],
  validateRequest,
  asyncHandler(productController.createProduct)
); // Create product

export default router;
