import express from "express";
import {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine
} from "../controllers/vendingMachineController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// GETs are protected: allow admin, refiller, viewer
router.get("/", protect, authorize("admin", "refiller", "viewer"), getMachines);        // List machines
router.get("/:id", protect, authorize("admin", "refiller", "viewer"), getMachineById); // Get machine by ID

// Writes guarded for admin only
router.post("/", protect, authorize("admin"), createMachine);    // Create machine (admin)
router.put("/:id", protect, authorize("admin"), updateMachine);  // Update machine (admin)
router.delete("/:id", protect, authorize("admin"), deleteMachine); // Delete machine (admin)

export default router;
