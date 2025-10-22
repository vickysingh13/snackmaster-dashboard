import express from "express";
import {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine
} from "../controllers/vendingMachineController.js";

const router = express.Router();

router.get("/", getMachines);
router.get("/:id", getMachineById);
router.post("/", createMachine);
router.put("/:id", updateMachine);
router.delete("/:id", deleteMachine);

export default router;
