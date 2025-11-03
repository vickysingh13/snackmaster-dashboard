import mongoose from "mongoose";

const stockItemSchema = new mongoose.Schema(
  {
    // stored field is productId; expose alias 'product' so tests that use `product` still work
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      alias: "product",
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    // keep optional metadata that tests sometimes set (slot, productName, capacity)
    slot: { type: Number, default: null },
    productName: { type: String, default: "" },
    capacity: { type: Number, default: 0 },
  },
  { _id: false }
);

const vendingMachineSchema = new mongoose.Schema(
  {
    machineCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },
    lastRefilled: {
      type: Date,
      default: null,
    },
    totalSlots: {
      type: Number,
      required: true,
      min: 1,
    },
    stock: [stockItemSchema],
    maintenanceNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

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
  const slot = this.stock.find((s) => {
    // support both alias 'product' and stored 'productId'
    const p = s.productId ?? s.product;
    if (!p) return false;
    if (typeof p.equals === "function") return p.equals(productId);
    return String(p) === String(productId);
  });
  if (slot) {
    slot.quantity = Math.max((slot.quantity || 0) + qtyChange, 0);
  } else if (qtyChange > 0) {
    this.stock.push({ productId, quantity: qtyChange });
  }
  await this.save();
  return this;
};

// Conditional export to prevent OverwriteModelError
export default mongoose.models.VendingMachine || mongoose.model("VendingMachine", vendingMachineSchema);