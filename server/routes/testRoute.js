// server/routes/testRoute.js
import express from "express";
import Test from "../models/Test.js";

const router = express.Router();
router.use(express.json());

// CREATE a test document
router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    const newTest = new Test({ text });
    const savedTest = await newTest.save();
    res.status(201).json(savedTest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ all test documents
router.get("/", async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ single test by ID
router.get("/:id", async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE test by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE test by ID
router.delete("/:id", async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.json({ message: "Test deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
