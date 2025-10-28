import mongoose from "mongoose";
import { info } from "../utils/logger.js";

const refillLogSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  machineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VendingMachine",
    required: true
  },
  quantityAdded: {
    type: Number,
    required: true,
    min: 1
  },
  refilledBy: {
    type: String, // Can later be changed to userId ref
    required: true
  },
  remarks: {
    type: String,
    default: ""
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// 🧠 Middleware: update product quantity automatically when refill log is created
refillLogSchema.post("save", async function (doc) {
  try {
    const Product = mongoose.model("Product");

    // Increment the product quantity after refill
    await Product.findByIdAndUpdate(
      doc.productId,
      { $inc: { quantity: doc.quantityAdded } },
      { new: true }
    );

    info(`Stock updated for Product ID: ${doc.productId}`);
  } catch (error) {
    console.error("❌ Error updating product stock from refill log:", error.message);
  }
});

export default mongoose.model("RefillLog", refillLogSchema);
