import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);        // Get all products
router.get("/:id", getProductById);  // Get product by ID
router.post("/", createProduct);     // Create product
router.put("/:id", updateProduct);   // Update product
// DELETE product (admin only)
router.delete("/:id", protect, authorize("admin"), deleteProduct); // Delete product

export default router;
