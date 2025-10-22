import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  inStock: { type: Boolean, default: true },

  // 🧩 Linking products to vending machines
  machineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VendingMachine",
    required: true
  }
}, { timestamps: true });

// 🧠 Automatically update inStock status
productSchema.pre("save", function (next) {
  this.inStock = this.quantity > 0;
  next();
});

export default mongoose.model("Product", productSchema);
