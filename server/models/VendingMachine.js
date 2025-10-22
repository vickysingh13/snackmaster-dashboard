import mongoose from "mongoose";

const vendingMachineSchema = new mongoose.Schema({
  machineCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "maintenance"],
    default: "active"
  },
  lastRefilled: {
    type: Date,
    default: null
  },
  totalSlots: {
    type: Number,
    required: true,
    min: 1
  },
  stock: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  ],
  maintenanceNotes: {
    type: String,
    default: ""
  }
}, { timestamps: true });

// 🧠 Pre-save validation to ensure stock doesn't exceed total slots
vendingMachineSchema.pre("save", function (next) {
  const totalQuantity = this.stock.reduce((sum, slot) => sum + (slot.quantity || 0), 0);
  if (totalQuantity > this.totalSlots) {
    return next(new Error("Total stocked items exceed available slots."));
  }
  next();
});

// 🪄 Helper Method: Update stock for a specific product
vendingMachineSchema.methods.updateStock = async function (productId, qtyChange) {
  const slot = this.stock.find(s => s.productId.toString() === productId.toString());
  if (slot) {
    slot.quantity = Math.max(slot.quantity + qtyChange, 0);
  } else if (qtyChange > 0) {
    this.stock.push({ productId, quantity: qtyChange });
  }
  await this.save();
  return this;
};


// Conditional export to prevent OverwriteModelError
export default mongoose.models.VendingMachine || mongoose.model("VendingMachine", vendingMachineSchema);