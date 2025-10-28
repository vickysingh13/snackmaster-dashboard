import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { body } from "express-validator";
import validateRequest from "../middleware/validateRequest.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", getProducts);        // Get all products
router.get("/:id", getProductById);  // Get product by ID
router.post(
  "/",
  [body("name").isString().notEmpty(), body("price").isNumeric()],
  validateRequest,
  asyncHandler(createProduct)
);     // Create product
router.put("/:id", updateProduct);   // Update product
// DELETE product (admin only)
router.delete("/:id", protect, authorize("admin"), deleteProduct); // Delete product

export default router;
