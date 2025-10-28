import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import { createRefill } from "../controllers/refillController.js";

const router = express.Router();

router.post("/", asyncHandler(createRefill));

export default router;
