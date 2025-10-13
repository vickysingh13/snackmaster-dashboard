// server/index.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route for API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// Optional: Root route
app.get("/", (req, res) => {
  res.send("Backend server running. Try /api/health");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
