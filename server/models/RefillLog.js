import mongoose from "mongoose";
import { info, error as logError } from "../utils/logger.js";

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

// post-save hook: increment product quantity safely
refillLogSchema.post("save", async function (doc) {
  try {
    const Product = mongoose.model("Product");
    // increment product quantity by quantityAdded
    await Product.findByIdAndUpdate(doc.productId, { $inc: { quantity: doc.quantityAdded } });
    info(`Stock updated for Product ID: ${doc.productId}`);
  } catch (error) {
    logError("Error updating product quantity after refill:", error);
  }
});

export default mongoose.model("RefillLog", refillLogSchema);
