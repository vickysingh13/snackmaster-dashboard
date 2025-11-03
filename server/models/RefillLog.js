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

// Post-save hook is now opt-in to avoid duplicate updates when controller handles increments.
// Set USE_REFILL_HOOK=true in env to enable this legacy behavior (not recommended).
if (String(process.env.USE_REFILL_HOOK).toLowerCase() === "true") {
  refillLogSchema.post("save", async function (doc) {
    try {
      const Product = mongoose.model("Product");
      await Product.findByIdAndUpdate(doc.productId, { $inc: { quantity: doc.quantityAdded } });
      // eslint-disable-next-line no-console
      console.info("RefillHook: Stock updated for Product ID:", doc.productId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("RefillHook error updating product quantity:", error);
    }
  });
}

export default mongoose.model("RefillLog", refillLogSchema);
