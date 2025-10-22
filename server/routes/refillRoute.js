import express from "express";
import { getRefills, createRefill } from "../controllers/refillController.js";

const router = express.Router();

router.get("/", getRefills);
router.post("/", createRefill);

export default router;
